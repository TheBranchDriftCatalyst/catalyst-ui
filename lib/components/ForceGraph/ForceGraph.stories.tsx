import React from 'react';
import ForceGraph, { parseDockerCompose } from './ForceGraph';

export default {
  title: 'Components/ForceGraph',
  component: ForceGraph,
};

const dockerComposeYaml = `
version: "3.7"

volumes:
  completed_downloads_v:
    external: true
    name: downloaders_completed_downloads_v
  movies_vol:
    external: true
    name: frontends_movies_volume
  tv_vol:
    external: true
    name: frontends_tv_volume
  anime_vol:
    external: true
    name: frontends_anime_volume
  px_200_vol:
    driver_opts:
      type: nfs4
      o: addr=$TRUENAS_IP,rw,nolock
      device: ":$PX200_MOUNT/poon"
  px_200_meta:
    driver_opts:
      type: nfs4
      o: addr=$TRUENAS_IP,rw,nolock
      device: ":$PX200_MOUNT/.stash_meta"

networks:
  proxy:
    name: drogon_proxy_network
    external: true
  infra:
    name: infra_default
    external: true

services:
  themepark:
    image: gilbn/theme.park
    environment:
      - PUID
      - PGID
      - TZ=America/Denver
      - TP_URLBASE=themepark
    networks:
      - infra
  radarr:
    image: linuxserver/radarr:latest
    environment:
      - PUID
      - PGID
      - TZ
    volumes:
      - services_mnt/radarr:/config
      - movies_vol:/videos
      - completed_downloads_v:/completed-downloads
    networks:
      - infra
      - proxy
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.services.radarr.loadbalancer.server.port=7878"
        - "traefik.http.routers.radarr-internal.rule=Host(\`radarr.$INTERNAL_HOST\`)"
        - "traefik.http.routers.radarr-internal.entrypoints=web"
        - "traefik.http.routers.radarr-external.rule=Host(\`radarr.$EXTERNAL_HOST\`)"
        - "traefik.http.routers.radarr-external.entrypoints=websecure"
        - "traefik.http.routers.radarr-external.middlewares=basic-auth"
        - "traefik.http.routers.radarr-external.tls.certresolver=letsencrypt"

  sonarr:
    image: linuxserver/sonarr:latest
    environment:
      - PUID
      - PGID
      - TZ
    volumes:
      - services_mnt/sonarr:/config
      - tv_vol:/tv
      - anime_vol:/anime
      - completed_downloads_v:/completed-downloads
    networks:
      - infra
      - proxy
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.services.sonarr.loadbalancer.server.port=8989"
        - "traefik.http.routers.sonarr-internal.rule=Host(\`sonarr.$INTERNAL_HOST\`)"
        - "traefik.http.routers.sonarr-internal.entrypoints=web"
        - "traefik.http.routers.sonarr-external.rule=Host(\`sonarr.$EXTERNAL_HOST\`)"
        - "traefik.http.routers.sonarr-external.entrypoints=websecure"
        - "traefik.http.routers.sonarr-external.middlewares=basic-auth"
        - "traefik.http.routers.sonarr-external.tls.certresolver=letsencrypt"
  headless-shell:
    image: chromedp/headless-shell:latest
    networks:
      - infra
  stash:
    image: stashapp/stash:latest
    networks:
      - infra
      - proxy
    environment:
      - PUID
      - PGID
      - STASH_STASH=/data/
      - STASH_GENERATED=/metadata/generated
      - STASH_METADATA=/metadata/metadata
      - STASH_CACHE=/cache/
      - STASH_PORT=9999
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - services_mnt/stash:/root/.stash
      - px_200_meta:/metadata
      - px_200_vol:/data
      - services_mnt/stash/cache:/cache
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.services.stash.loadbalancer.server.port=9999"
        - "traefik.http.routers.stash-internal.rule=Host(\`stash.$INTERNAL_HOST\`)"
        - "traefik.http.routers.stash-internal.entrypoints=web"
`;

const { services, volumes, networks, links } = parseDockerCompose(dockerComposeYaml);

export const DockerComposeGraph = () => (
  <ForceGraph services={services} volumes={volumes} networks={networks} links={links} width={1000} height={800} />
);
