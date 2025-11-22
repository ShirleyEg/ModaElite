package com.Proyecto.PA.predictor.controller;

import com.Proyecto.PA.predictor.model.PredictRequest;
import com.Proyecto.PA.predictor.service.WekaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import weka.core.Instance;
import weka.core.Instances;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST que expone endpoints para:
 * - /predict  : POST para predecir ventas
 * - /metrics  : GET para obtener métricas del modelo
 * - /sample   : GET para obtener una fila de ejemplo del dataset
 */
@RestController
@RequestMapping("/api")
public class PredictionController {

    private final WekaService wekaService;

    public PredictionController(WekaService wekaService) {
        this.wekaService = wekaService;
    }

    /**
     * Endpoint para predecir ventas de una prenda.
     *
     * Ejemplo de JSON:
     * {
     *   "date":"2024-06-15",
     *   "category":"Shirt",
     *   "size":"M",
     *   "color":"Blue",
     *   "price":29.99,
     *   "inventory":50
     * }
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
    public ResponseEntity<?> metrics() {
        return ResponseEntity.ok(wekaService.getMetrics());
    }

    /**
     * Devuelve una instancia de ejemplo del dataset de entrenamiento en formato simple.
     *
     * @return fila de ejemplo con atributos y valores
     */
    @GetMapping("/sample")
    public ResponseEntity<?> sample() {
        Instances data = wekaService.getTrainingData();
        if (data == null || data.size() == 0) {
            return ResponseEntity.noContent().build();
        }
        Instance inst = data.get(0);
        Map<String, Object> m = new HashMap<>();
        for (int i = 0; i < data.numAttributes(); i++) {
            m.put(data.attribute(i).name(), inst.toString(i));
        }
        return ResponseEntity.ok(m);
    }

    /**
     * Exporta el dataset de entrenamiento a CSV y devuelve la ruta del archivo.
     *
     * @return ruta del archivo CSV generado
     */
    @GetMapping("/export-csv")
    public ResponseEntity<?> exportCSV() {
        try {
            Instances data = wekaService.getTrainingData();
            if (data == null || data.size() == 0) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Dataset vacío");
                return ResponseEntity.badRequest().body(err);
            }

            String csvPath = System.getProperty("java.io.tmpdir") + "garment_sales_dataset.csv";
            com.Proyecto.PA.predictor.util.DatasetGenerator.exportToCSV(data, csvPath);

            Map<String, String> resp = new HashMap<>();
            resp.put("file_path", csvPath);
            resp.put("records", String.valueOf(data.numInstances()));
            return ResponseEntity.ok(resp);
        } catch (IOException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}