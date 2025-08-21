SELECT 
  e.programa,
  p.periodo,
  SUM(p.monto) AS total_morosidad
FROM pagos p
JOIN estudiantes e ON p.cedula = e.cedula
GROUP BY e.programa, p.periodo;
-- Este script SQL calcula la morosidad total por programa y periodo