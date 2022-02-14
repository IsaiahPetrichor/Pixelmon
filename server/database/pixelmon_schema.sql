CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
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

INSERT INTO areas (type, name, finished, terrain_finished, foliage_finished, buildings_finished, interiors_finished, pokemon_finished, trainers_finished, npcs_finished, floor_loot_finished, music_finished, events_finished)
VALUES ('route', 'Route 1', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 2', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 3', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 4', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 5', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 6', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 7', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 8', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 9', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 10', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 11', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 12', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 13', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 14', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 15', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 16', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 17', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 18', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 19', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 20', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 21', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 22', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 23', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 24', false, false, false, false, false, false, false, false, false, false, false),
('route', 'Route 25', false, false, false, false, false, false, false, false, false, false, false);

INSERT INTO areas (type, name, finished, terrain_finished, foliage_finished, buildings_finished, interiors_finished, pokemon_finished, trainers_finished, npcs_finished, floor_loot_finished, music_finished, events_finished)
VALUES ('city', 'Cerulean City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Cinnabar Island', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Celadon City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Fuchsia City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Lavender Town', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Pallet Town', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Pewter City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Saffron City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Vermillion City', false, false, false, false, false, false, false, false, false, false, false),
('city', 'Viridian City', false, false, false, false, false, false, false, false, false, false, false);

INSERT INTO areas (type, name, finished, terrain_finished, foliage_finished, buildings_finished, interiors_finished, pokemon_finished, trainers_finished, npcs_finished, floor_loot_finished, music_finished, events_finished)
VALUES ('cave', 'Cerulean Cave', false, false, false, false, false, false, false, false, false, false, false),
('cave', 'Diglett"s Cave', false, false, false, false, false, false, false, false, false, false, false),
('cave', 'Mt. Moon', false, false, false, false, false, false, false, false, false, false, false),
('cave', 'Rock Tunnel', false, false, false, false, false, false, false, false, false, false, false),
('cave', 'Seafoam Islands', false, false, false, false, false, false, false, false, false, false, false),
('cave', 'Victory Road', false, false, false, false, false, false, false, false, false, false, false);

INSERT INTO areas (type, name, finished, terrain_finished, foliage_finished, buildings_finished, interiors_finished, pokemon_finished, trainers_finished, npcs_finished, floor_loot_finished, music_finished, events_finished)
VALUES ('special', 'Indigo Plateau', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Pokemon Mansion', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Pokemon Tower', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Power Plant', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Rocket Hideout', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Safari Zone', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Silph Co.', false, false, false, false, false, false, false, false, false, false, false),
('special', 'SS Anne', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Underground 5-6', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Underground 7-8', false, false, false, false, false, false, false, false, false, false, false),
('special', 'Viridian Forest', false, false, false, false, false, false, false, false, false, false, false);