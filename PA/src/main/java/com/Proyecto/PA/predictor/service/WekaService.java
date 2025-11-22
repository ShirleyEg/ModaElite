package com.Proyecto.PA.predictor.service;

import com.Proyecto.PA.predictor.model.PredictRequest;
import com.Proyecto.PA.predictor.util.DatasetGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.trees.RandomForest;
import weka.core.DenseInstance;
import weka.core.Instances;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Servicio que encapsula la lógica de entrenamiento y predicción con Weka.
 * - Genera dataset sintético
 * - Entrena un RandomForest
 * - Expone método de predicción y métricas
 */
@Service
public class WekaService {

    private static final Logger logger = LoggerFactory.getLogger(WekaService.class);

    /**
     * Estructura de datos Weka usada para entrenar (y para dar formato a instancias de input).
     */
    private Instances trainingData;

    /**
     * Clasificador entrenado en memoria.
     */
    private Classifier classifier;

    /**
     * Métricas de evaluación (RMSE, correlación).
     */
    private double rmse = Double.NaN;
    private double correlation = Double.NaN;

    /**
     * Genera dataset y entrena el modelo al iniciar el servicio.
     */
    @PostConstruct
    public void init() {
        logger.info("Generando dataset sintético (>=5000 registros)...");
        this.trainingData = DatasetGenerator.generateDataset(5000);

        logger.info("Entrenando RandomForest...");
        try {
            RandomForest rf = new RandomForest();
            rf.setNumIterations(100);
            rf.buildClassifier(trainingData);
            this.classifier = rf;

            // Evaluación con cross-validation
            Evaluation eval = new Evaluation(trainingData);
            eval.crossValidateModel(rf, trainingData, 5, new Random(1));
            this.rmse = eval.rootMeanSquaredError();
            this.correlation = eval.correlationCoefficient();

            logger.info(String.format("Entrenamiento finalizado. RMSE=%.4f, Corr=%.4f", rmse, correlation));

            // Exportar dataset a CSV automáticamente
            exportDatasetToCSV();
        } catch (Exception e) {
            logger.error("Error entrenando el modelo Weka", e);
        }
    }

    /**
     * Exporta el dataset de entrenamiento a CSV automáticamente.
     */
    private void exportDatasetToCSV() {
        try {
            String csvPath = System.getProperty("java.io.tmpdir") + "garment_sales_dataset.csv";
            DatasetGenerator.exportToCSV(trainingData, csvPath);
            logger.info("Dataset exportado a CSV: " + csvPath);
        } catch (IOException e) {
            logger.error("Error al exportar dataset a CSV", e);
        }
    }

    /**
     * Predice la cantidad de ventas a partir de un request DTO.
     *
     * @param req datos de entrada (date en formato yyyy-MM-dd, category, size, color, price, inventory)
     * @return predicción numérica (double)
     * @throws Exception si hay error en la predicción
     */
    public double predict(PredictRequest req) throws Exception {
        if (classifier == null || trainingData == null) {
            throw new IllegalStateException("Modelo no entrenado");
        }

        // Creamos instancia con el mismo esquema
        DenseInstance inst = new DenseInstance(trainingData.numAttributes());
        inst.setDataset(trainingData);

        // date -> días desde epoch
        long days = java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.of(1970, 1, 1),
                java.time.LocalDate.parse(req.getDate()));
        inst.setValue(0, days);

        // category, size, color (Weka acepta el String y mapea internamente)
        inst.setValue(1, req.getCategory());
        inst.setValue(2, req.getSize());
        inst.setValue(3, req.getColor());

        inst.setValue(4, req.getPrice());
        inst.setValue(5, req.getInventory());

        // Clase (sales) desconocida al predecir -> la dejamos como missing
        inst.setMissing(trainingData.classIndex());

        double pred = classifier.classifyInstance(inst);

        // Para robustez, no devolver negativos
        return Math.max(0.0, pred);
    }

    /**
     * Devuelve métricas del modelo.
     *
     * @return mapa con RMSE y correlación
     */
    public Map<String, Double> getMetrics() {
        Map<String, Double> m = new HashMap<>();
        m.put("rmse", rmse);
        m.put("correlation", correlation);
        return m;
    }

    /**
     * Devuelve una copia del dataset de entrenamiento (puede usarse para mostrar muestras).
     *
     * @return Instances con los datos de entrenamiento
     */
    public Instances getTrainingData() {
        return trainingData;
    }
}