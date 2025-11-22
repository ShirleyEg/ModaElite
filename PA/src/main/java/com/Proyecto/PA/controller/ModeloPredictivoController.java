package com.Proyecto.PA.controller;

import com.Proyecto.PA.predictor.model.PredictRequest;
import com.Proyecto.PA.predictor.service.WekaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
public class ModeloPredictivoController {

    private final WekaService wekaService;

    public ModeloPredictivoController(WekaService wekaService) {
        this.wekaService = wekaService;
    }

    /**
     * Endpoint para predecir ventas de una prenda.
     *
     * @param req request DTO con features
     * @return mapa con la predicción
     */
    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody PredictRequest req) {
        try {
            double pred = wekaService.predict(req);
            Map<String, Object> resp = new HashMap<>();
            resp.put("prediction", pred);
            resp.put("unit", "units");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    /**
     * Devuelve métricas de evaluación del modelo (RMSE, correlación).
     *
     * @return métricas
     */
    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics() {
        try {
            Map<String, Double> metrics = wekaService.getMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Error al obtener métricas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    /**
     * Devuelve una instancia de ejemplo del dataset de entrenamiento.
     *
     * @return fila de ejemplo con atributos y valores
     */
    @GetMapping("/sample")
    public ResponseEntity<?> getSample() {
        try {
            // Obtener una muestra del dataset
            weka.core.Instances data = wekaService.getTrainingData();
            if (data == null || data.size() == 0) {
                return ResponseEntity.noContent().build();
            }
            
            // Tomar la primera instancia como ejemplo
            weka.core.Instance inst = data.get(0);
            Map<String, Object> m = new HashMap<>();
            for (int i = 0; i < data.numAttributes(); i++) {
                m.put(data.attribute(i).name(), inst.toString(i));
            }
            
            return ResponseEntity.ok(m);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Error al obtener muestra: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}