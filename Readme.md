11 - 17 => 1) Anaylsis section do it 
2) thinking to make API/application/web.ts timing during fetching the data of website to be accuratly mentioned not undefined.
3) Think of moving to micro service architure . 
4) Think of Integrating Channels with the application.
5) Documentations of the projects.

CREATE EXTENSION timescaledb;

SELECT create_hypertable('websitetick', 'createdAt',migrate_data=>true);

add this to the readme