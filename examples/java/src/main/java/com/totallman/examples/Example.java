package com.totallman.examples;

import com.totallman.TallmanConverter;

public class Example {
    public static void main(String[] args) {
        String sample = "Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.";
        String text = args.length > 0 ? String.join(" ", args) : sample;

        System.out.println("Input:   " + text);
        System.out.println("DEFAULT: " + TallmanConverter.toTallman(text));
        System.out.println("AU:      " + TallmanConverter.toTallman(text, "AU"));
    }
}
