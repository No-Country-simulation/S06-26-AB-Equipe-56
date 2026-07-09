import csv
import io
import os
import psycopg2
from collections import defaultdict

UPLOADS = "C:\\Users\\rafam\\OneDrive\\Área de Trabalho\\HackatonNoCountry\\dados"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_pXFSH71xCoiP@ep-wispy-moon-at5mwfyo-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
print("Conectado ao banco via DATABASE_URL")

def read_csv(name):
    with open(f"{UPLOADS}/{name}", encoding="utf-8") as f:
        return list(csv.DictReader(f))

# ---------------------------------------------------------------
# 1) VisentCluster: união de todos os clusters citados em
#    qualquer arquivo. Município/centróide vêm de antenas_flp.csv
#    quando existir (agregando por moda/média); senão ficam nulos.
# ---------------------------------------------------------------
antenas = read_csv("antenas_flp.csv")
assinantes = read_csv("assinantes.csv")
tensor_od = read_csv("tensor_od.csv")
trajetos = read_csv("trajetos_comuns.csv")
tempo_desl = read_csv("tensor_tempo_deslocamento.csv")
fluxo_vias = read_csv("tensor_fluxo_vias.csv")
concentracao = read_csv("tensor_concentracao.csv")
kanon = read_csv("sumario_kanon.csv")

cluster_municipios = defaultdict(list)
cluster_lats = defaultdict(list)
cluster_lons = defaultdict(list)
for row in antenas:
    c = row["cluster"]
    cluster_municipios[c].append(row["municipio"])
    cluster_lats[c].append(float(row["lat"]))
    cluster_lons[c].append(float(row["lon"]))

all_clusters = set(cluster_municipios.keys())
all_clusters |= {r["home_cluster"] for r in assinantes}
all_clusters |= {r["cluster_origem"] for r in tensor_od} | {r["cluster_destino"] for r in tensor_od}
all_clusters |= {r["cluster_origem"] for r in tempo_desl} | {r["cluster_destino"] for r in tempo_desl}

def moda(lst):
    if not lst:
        return None
    return max(set(lst), key=lst.count)

cluster_rows = []
for c in sorted(all_clusters):
    municipio = moda(cluster_municipios.get(c, []))
    lats = cluster_lats.get(c, [])
    lons = cluster_lons.get(c, [])
    lat = sum(lats) / len(lats) if lats else None
    lon = sum(lons) / len(lons) if lons else None
    cluster_rows.append((c, municipio, lat, lon))

cur.executemany(
    "INSERT INTO VisentCluster (cluster_nome, municipio_predominante, lat_centroide, lon_centroide) VALUES (%s,%s,%s,%s)",
    cluster_rows,
)
print(f"VisentCluster: {len(cluster_rows)} linhas")

# ---------------------------------------------------------------
# 2) VisentAntena
# ---------------------------------------------------------------
rows = [(int(r["ecgi"]), r["cluster"], r["municipio"], float(r["lat"]), float(r["lon"])) for r in antenas]
cur.executemany(
    "INSERT INTO VisentAntena (ecgi, cluster_nome, municipio, lat, lon) VALUES (%s,%s,%s,%s,%s)",
    rows,
)
print(f"VisentAntena: {len(rows)} linhas")

# ---------------------------------------------------------------
# 3) VisentAssinante (200k linhas -> usar COPY para performance)
# ---------------------------------------------------------------
buf = io.StringIO()
for r in assinantes:
    buf.write(
        "\t".join([
            r["assinante_hash"],
            r["home_cluster"],
            r["home_municipio"] or "\\N",
            r["income_cluster"],
            r["age_group"],
            r["mobility_pattern"],
            "t" if r["flag_flagship"] == "1" else "f",
        ]) + "\n"
    )
buf.seek(0)
cur.copy_expert(
    "COPY VisentAssinante (assinante_hash, home_cluster, home_municipio, income_cluster, age_group, mobility_pattern, flag_flagship) FROM STDIN WITH (FORMAT text, NULL '\\N')",
    buf,
)
print(f"VisentAssinante: {len(assinantes)} linhas")

# ---------------------------------------------------------------
# 4) VisentConcentracaoAntena
# ---------------------------------------------------------------
buf = io.StringIO()
for r in concentracao:
    buf.write(
        "\t".join([
            r["ecgi"], r["day_date"], r["periodo"], r["n_usuarios"], r["n_sessoes"],
            r["download_bytes"], r["upload_bytes"], r["dur_media_s"], r["drop_pct_medio"],
            r["congestionamento_medio"], r["chamadas_total"], r["mensagens_total"],
        ]) + "\n"
    )
buf.seek(0)
cur.copy_expert(
    "COPY VisentConcentracaoAntena (ecgi, day_date, periodo, n_usuarios, n_sessoes, download_bytes, upload_bytes, dur_media_s, drop_pct_medio, congestionamento_medio, chamadas_total, mensagens_total) FROM STDIN WITH (FORMAT text)",
    buf,
)
print(f"VisentConcentracaoAntena: {len(concentracao)} linhas")

# ---------------------------------------------------------------
# 5) VisentFluxoVias
# ---------------------------------------------------------------
buf = io.StringIO()
for r in fluxo_vias:
    buf.write(
        "\t".join([
            r["ecgi_origem"], r["ecgi_destino"], r["n_usuarios"], r["n_transicoes"],
            r["dist_km"], r["periodo_predominante"], r["pct_do_cluster_origem"],
        ]) + "\n"
    )
buf.seek(0)
cur.copy_expert(
    "COPY VisentFluxoVias (ecgi_origem, ecgi_destino, n_usuarios, n_transicoes, dist_km, periodo_predominante, pct_do_cluster_origem) FROM STDIN WITH (FORMAT text)",
    buf,
)
print(f"VisentFluxoVias: {len(fluxo_vias)} linhas")

# ---------------------------------------------------------------
# 6) VisentFluxoCluster (tensor_od.csv + trajetos_comuns.csv)
#    Linhas com cluster_destino sem município (ex: SAO_JOSE_ROÇADO)
#    ainda referenciam VisentCluster (que já contém esse cluster
#    via união acima), então a FK passa normalmente.
# ---------------------------------------------------------------
buf = io.StringIO()
for arquivo, dataset in (("tensor_od", tensor_od), ("trajetos_comuns", trajetos)):
    for r in dataset:
        buf.write(
            "\t".join([
                r["cluster_origem"], r["cluster_destino"],
                "t" if r["mesmo_cluster"] == "1" else "f",
                r["n_usuarios"], r["n_viagens"], r["dist_media_km"],
                r["periodo_predominante"], arquivo,
            ]) + "\n"
        )
buf.seek(0)
cur.copy_expert(
    "COPY VisentFluxoCluster (cluster_origem, cluster_destino, mesmo_cluster, n_usuarios, n_viagens, dist_media_km, periodo_predominante, arquivo_origem) FROM STDIN WITH (FORMAT text)",
    buf,
)
print(f"VisentFluxoCluster: {len(tensor_od) + len(trajetos)} linhas")

# ---------------------------------------------------------------
# 7) VisentTempoDeslocamento
# ---------------------------------------------------------------
buf = io.StringIO()
for r in tempo_desl:
    buf.write(
        "\t".join([
            r["cluster_origem"], r["cluster_destino"],
            "t" if r["mesmo_cluster"] == "1" else "f",
            r["n_observacoes"], r["dist_media_km"], r["dist_p25_km"], r["dist_p75_km"],
            r["periodo_predominante"],
        ]) + "\n"
    )
buf.seek(0)
cur.copy_expert(
    "COPY VisentTempoDeslocamento (cluster_origem, cluster_destino, mesmo_cluster, n_observacoes, dist_media_km, dist_p25_km, dist_p75_km, periodo_predominante) FROM STDIN WITH (FORMAT text)",
    buf,
)
print(f"VisentTempoDeslocamento: {len(tempo_desl)} linhas")

# ---------------------------------------------------------------
# 8) VisentSumarioKanon
# ---------------------------------------------------------------
rows = [(r["parametro"], r["valor"]) for r in kanon]
cur.executemany("INSERT INTO VisentSumarioKanon (parametro, valor) VALUES (%s,%s)", rows)
print(f"VisentSumarioKanon: {len(rows)} linhas")

conn.commit()
print("OK - commit realizado")
cur.close()
conn.close()