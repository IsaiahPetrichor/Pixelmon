CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE areas (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    name VARCHAR(32) NOT NULL,
    finished boolean NOT NULL,
    terrain_finished boolean NOT NULL,
    foliage_finished boolean NOT NULL,
    buildings_finished boolean NOT NULL,
    interiors_finished boolean NOT NULL,
    pokemon_finished boolean NOT NULL,
    trainers_finished boolean NOT NULL,
    npcs_finished boolean NOT NULL,
    floor_loot_finished boolean NOT NULL,
    music_finished boolean NOT NULL,
    events_finished boolean NOT NULL
);