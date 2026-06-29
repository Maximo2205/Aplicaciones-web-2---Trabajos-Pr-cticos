import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'

export function comprobarToken(req, res, next) {
    try {
        const token = req.signedCookies['token']

        if (!token) {
            return res.redirect('/login')
        }

        jwt.verify(token, process.env.FIRMA_JWT, (error, payload) => {
            if (error) {
                console.error(error)
                return res.redirect('/login')
            }

            next()
        })
    } catch (error) {
        console.error('Error crítico en middleware comprobarToken:', error)
        return res.redirect('/login')
    }
}

export function validarDatosComponente(req, res, next) {
    try {
        const { name, category, gpuLenght, coolerHeight, m2Key } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                error: 'El nombre y la categoría son obligatorios.'
            });
        }

        if (name.length > 255) {
            return res.status(400).json({
                error: 'El nombre del componente excede el límite de 255 caracteres.'
            });
        }

        if (category.length > 15) {
            return res.status(400).json({
                error: 'La categoría excede el límite de 15 caracteres.'
            });
        }

        if (gpuLenght !== undefined && gpuLenght !== null && gpuLenght !== '') {
            const numGpu = parseFloat(gpuLenght);
            if (isNaN(numGpu) || numGpu < 0 || numGpu > 999.99) {
                return res.status(400).json({
                    error: 'La longitud de la GPU (gpuLenght) debe ser un número válido entre 0 y 999.99.'
                });
            }
        }

        if (coolerHeight !== undefined && coolerHeight !== null && coolerHeight !== '') {
            const numCooler = parseFloat(coolerHeight);
            if (isNaN(numCooler) || numCooler < 0 || numCooler > 999.99) {
                return res.status(400).json({
                    error: 'La altura del cooler (coolerHeight) debe ser un número válido entre 0 y 999.99.'
                });
            }
        }

        if (m2Key !== undefined && m2Key !== null && m2Key !== '') {
            const keyStr = String(m2Key).trim();
            if (keyStr.length !== 1) {
                return res.status(400).json({
                    error: 'El campo m2Key debe tener exactamente 1 carácter (ej: "M", "B").'
                });
            }
        }

        next();

    } catch (error) {
        console.error('Error crítico en middleware validarDatosComponente:', error);
        return res.status(500).json({ error: 'Error interno al validar los datos.' });
    }
}