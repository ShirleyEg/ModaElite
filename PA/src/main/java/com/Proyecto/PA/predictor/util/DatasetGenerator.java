package com.Proyecto.PA.predictor.util;

import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Utilidad para generar un dataset sintético de ventas de prendas.
 * Genera al menos 5.000 instancias siguiendo una fórmula de demanda oculta.
 */
public class DatasetGenerator {

    /**
     * Genera un Instances de Weka con atributos:
     * dateNumeric (numeric), category (nominal), size (nominal), color (nominal),
     * price (numeric), inventory (numeric), sales (numeric target).
     *
     * @param nRows número de instancias a generar (se recomienda >= 5000)
     * @return dataset Weka listo para entrenamiento (class index en última posición)
     */
    public static Instances generateDataset(int nRows) {
        if (nRows < 5000) {
            nRows = 5000;
        }

        // Definimos vocabularios nominales
        List<String> categories = Arrays.asList("Shirt", "Pants", "Dress", "Jacket", "Skirt");
        List<String> sizes = Arrays.asList("XS", "S", "M", "L", "XL");
        List<String> colors = Arrays.asList("Red", "Blue", "Green", "Black", "White");

        ArrayList<Attribute> attrs = new ArrayList<>();
        attrs.add(new Attribute("dateNumeric")); // días desde epoch
        attrs.add(new Attribute("category", categories));
        attrs.add(new Attribute("size", sizes));
        attrs.add(new Attribute("color", colors));
        attrs.add(new Attribute("price"));
        attrs.add(new Attribute("inventory"));
        attrs.add(new Attribute("sales")); // target numérico

        Instances data = new Instances("garment_sales", attrs, nRows);
        data.setClassIndex(data.numAttributes() - 1);

        Random rnd = new Random(42);

        // Popularidad base por categoría (factor de demanda)
        Map<String, Double> baseDemand = new HashMap<>();
        baseDemand.put("Shirt", 30.0);
        baseDemand.put("Pants", 25.0);
        baseDemand.put("Dress", 20.0);
        baseDemand.put("Jacket", 15.0);
        baseDemand.put("Skirt", 18.0);

        // Popularidad por talla
        Map<String, Double> sizeFactor = new HashMap<>();
        sizeFactor.put("XS", 0.8);
        sizeFactor.put("S", 1.0);
        sizeFactor.put("M", 1.2);
        sizeFactor.put("L", 1.0);
        sizeFactor.put("XL", 0.9);

        // Popularidad por color
        Map<String, Double> colorFactor = new HashMap<>();
        colorFactor.put("Red", 1.0);
        colorFactor.put("Blue", 1.1);
        colorFactor.put("Green", 0.9);
        colorFactor.put("Black", 1.2);
        colorFactor.put("White", 1.05);

        LocalDate startDate = LocalDate.of(2023, 1, 1);

        for (int i = 0; i < nRows; i++) {
            // Fecha aleatoria en un rango de 2 años
            LocalDate date = startDate.plusDays(rnd.nextInt(365 * 2));
            long daysSinceEpoch = ChronoUnit.DAYS.between(LocalDate.of(1970, 1, 1), date);

            // Selecciones nominales
            String cat = categories.get(rnd.nextInt(categories.size()));
            String size = sizes.get(rnd.nextInt(sizes.size()));
            String color = colors.get(rnd.nextInt(colors.size()));

            // Precio base según categoría más variación
            double basePrice;
            switch (cat) {
                case "Shirt":
                    basePrice = 25.0;
                    break;
                case "Pants":
                    basePrice = 40.0;
                    break;
                case "Dress":
                    basePrice = 60.0;
                    break;
                case "Jacket":
                    basePrice = 80.0;
                    break;
                case "Skirt":
                    basePrice = 35.0;
                    break;
                default:
                    basePrice = 30.0;
            }
            double price = Math.max(5.0, basePrice + rnd.nextGaussian() * basePrice * 0.15);

            // Inventario (0..200)
            int inventory = Math.max(0, (int) Math.round( Math.abs(rnd.nextGaussian() * 40 + 60) ));

            // Fórmula de ventas (real y oculta)
            double demand = baseDemand.get(cat)
                    * sizeFactor.get(size)
                    * colorFactor.get(color)
                    * Math.max(0.2, 1.0 - 0.01 * (price - basePrice)) // elasticidad simple
                    * (1.0 - Math.exp(-inventory / 20.0)); // efecto inventario (más inventario aumenta ventas hasta un tope)

            // Variación estacional simple (ej: más ventas en meses 5-8)
            int month = date.getMonthValue();
            double seasonFactor = (month >= 5 && month <= 8) ? 1.15 : 0.95;

            double noise = rnd.nextGaussian() * 3.0;
            double sales = Math.max(0.0, demand * seasonFactor + noise);

            // Limitamos ventas por inventario disponible
            double salesCapped = Math.min(sales, inventory);

            DenseInstance inst = new DenseInstance(data.numAttributes());
            inst.setValue(attrs.get(0), daysSinceEpoch);
            inst.setValue(attrs.get(1), cat);
            inst.setValue(attrs.get(2), size);
            inst.setValue(attrs.get(3), color);
            inst.setValue(attrs.get(4), price);
            inst.setValue(attrs.get(5), inventory);
            inst.setValue(attrs.get(6), salesCapped);

            data.add(inst);
        }

        return data;
    }

    /**
     * Exporta el dataset a un archivo CSV.
     *
     * @param data dataset Weka a exportar
     * @param filePath ruta del archivo CSV a crear
     * @throws IOException si hay error al escribir el archivo
     */
    public static void exportToCSV(Instances data, String filePath) throws IOException {
        try (FileWriter writer = new FileWriter(filePath)) {
            // Escribir cabecera con nombres de atributos
            for (int i = 0; i < data.numAttributes(); i++) {
                if (i > 0) writer.write(",");
                writer.write(data.attribute(i).name());
            }
            writer.write("\n");

            // Escribir instancias
            for (int i = 0; i < data.numInstances(); i++) {
                for (int j = 0; j < data.numAttributes(); j++) {
                    if (j > 0) writer.write(",");
                    writer.write(data.instance(i).toString(j));
                }
                writer.write("\n");
            }
        }
    }
}
