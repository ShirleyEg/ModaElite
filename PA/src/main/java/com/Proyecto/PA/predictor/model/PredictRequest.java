package com.Proyecto.PA.predictor.model;

/**
 * DTO que representa la petición de predicción.
 * Contiene las variables requeridas por el modelo.
 */
public class PredictRequest {

    /**
     * Fecha de la transacción (se convertirá a número, por ejemplo días desde epoch).
     */
    private String date; // ISO string yyyy-MM-dd

    /**
     * Categoría de prenda (ej: Shirt, Pants, Dress).
     */
    private String category;

    /**
     * Talla (ej: XS, S, M, L, XL).
     */
    private String size;

    /**
     * Color (ej: Red, Blue, Black).
     */
    private String color;

    /**
     * Precio de la prenda.
     */
    private double price;

    /**
     * Inventario disponible.
     */
    private int inventory;

    public PredictRequest() {
    }

    public PredictRequest(String date, String category, String size, String color, double price, int inventory) {
        this.date = date;
        this.category = category;
        this.size = size;
        this.color = color;
        this.price = price;
        this.inventory = inventory;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getInventory() {
        return inventory;
    }

    public void setInventory(int inventory) {
        this.inventory = inventory;
    }
}
