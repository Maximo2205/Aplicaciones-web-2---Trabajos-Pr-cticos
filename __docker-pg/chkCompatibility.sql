-- Conectar a la base de datos 'chkCompatibility'
\c chkCompatibility;

-- Crear la tabla 'componentes'
CREATE TABLE componentes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(15),
    cpuSocket VARCHAR(255),
    cpuChipset VARCHAR(255),
    ramDdr INT,
    coolerHeight NUMERIC(5,2),
    m2Format VARCHAR(255),
    m2Key CHAR(1),
    psuFormat VARCHAR(255),
    gpuPcie INT,
    gpuLenght NUMERIC(5,2),
    mbFormat VARCHAR(255)
);

-- Insertar 9 componentes
INSERT INTO componentes (category, name, cpuSocket, cpuChipset, ramDdr, coolerHeight, m2Format, m2Key, psuFormat, gpuPcie, gpuLenght, mbFormat) VALUES
    ('cpu', 'AMD Ryzen 5 9600X', 'AM5', 'A620, X670E, X670, B650E, B650, X870E, X870, B840, B850', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('motherboard', 'Gigabyte X870 Gaming X WIFI7', 'AM5', 'X870', 5, NULL, '25110, 22110, 2580, 2280', 'M', NULL, 5, NULL, 'ATX'),
    ('ram', 'Crucial Pro DDR5', NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('cpuCooler', 'Cooler Master Hyper 212 3DHP Black ARGB', 'LGA1851', 'LGA1700, LGA1200, LGA1151, LGA1150, LGA1155, LGA1156, AM5, AM4', NULL, NULL, 158, NULL, NULL, NULL, NULL, NULL, NULL),  
    ('M2', 'Kingston NV3', NULL, NULL, NULL, NULL, '2280', 'M', NULL, NULL, NULL, NULL),
    ('chassis', 'Corsair 4000D Frame', NULL, NULL, NULL, 170, NULL, NULL, 'ATX, SFX', NULL, 430, 'Mini-ITX, Micro-ATX, ATX, E-ATX'),
    ('psu', 'Cooler Master MWE Gold 850W V3', NULL, NULL, NULL, NULL, NULL, NULL, 'ATX', NULL, NULL, NULL),
    ('gpu', 'Gigabyte Nvidia GeForce RTX 5080 Gaming OC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 340, NULL),
    ('cpu', 'AMD Ryzen 5 5600X', 'AM4', 'A520, X470, B450, X570, B550', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)