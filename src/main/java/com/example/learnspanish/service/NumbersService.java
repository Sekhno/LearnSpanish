package com.example.learnspanish.service;

import com.example.learnspanish.model.NumberEntry;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NumbersService {

    private static final List<NumberEntry> NUMBERS = List.of(
        new NumberEntry(0,       "cero",        "zero",         null),
        new NumberEntry(1,       "uno",         "un / una",     "Gender: un (m), una (f) in Catalan; uno (m), una (f) in Spanish"),
        new NumberEntry(2,       "dos",         "dos / dues",   "Gender: dos (m), dues (f) in Catalan; dos in Spanish"),
        new NumberEntry(3,       "tres",        "tres",         null),
        new NumberEntry(4,       "cuatro",      "quatre",       "Spanish has 'cu', Catalan drops it to 'qu'"),
        new NumberEntry(5,       "cinco",       "cinc",         "Catalan ends with 'c', Spanish uses 'co'"),
        new NumberEntry(6,       "seis",        "sis",          null),
        new NumberEntry(7,       "siete",       "set",          "Catalan is shorter — no diphthong"),
        new NumberEntry(8,       "ocho",        "vuit",         "Completely different roots"),
        new NumberEntry(9,       "nueve",       "nou",          null),
        new NumberEntry(10,      "diez",        "deu",          null),
        new NumberEntry(11,      "once",        "onze",         null),
        new NumberEntry(12,      "doce",        "dotze",        null),
        new NumberEntry(13,      "trece",       "tretze",       null),
        new NumberEntry(14,      "catorce",     "catorze",      null),
        new NumberEntry(15,      "quince",      "quinze",       null),
        new NumberEntry(16,      "dieciséis",   "setze",        "Spanish compounds diez+y+seis; Catalan uses a unique root"),
        new NumberEntry(17,      "diecisiete",  "disset",       "Spanish: diez+y+siete; Catalan: dis+set"),
        new NumberEntry(18,      "dieciocho",   "divuit",       "Spanish: diez+y+ocho; Catalan: di+vuit"),
        new NumberEntry(19,      "diecinueve",  "dinou",        "Spanish: diez+y+nueve; Catalan: di+nou"),
        new NumberEntry(20,      "veinte",      "vint",         null),
        new NumberEntry(21,      "veintiuno",   "vint-i-un",    "Catalan explicitly writes 'i' (and); Spanish merges into veinti-"),
        new NumberEntry(22,      "veintidós",   "vint-i-dos",   null),
        new NumberEntry(30,      "treinta",     "trenta",       null),
        new NumberEntry(40,      "cuarenta",    "quaranta",     null),
        new NumberEntry(50,      "cincuenta",   "cinquanta",    null),
        new NumberEntry(60,      "sesenta",     "seixanta",     "Catalan uses 'x' (sh sound)"),
        new NumberEntry(70,      "setenta",     "setanta",      null),
        new NumberEntry(80,      "ochenta",     "vuitanta",     "Catalan derives from vuit (8); Spanish from ocho"),
        new NumberEntry(90,      "noventa",     "noranta",      null),
        new NumberEntry(100,     "cien",        "cent",         "Spanish 'cien' alone, 'ciento' in compounds (101=ciento uno)"),
        new NumberEntry(200,     "doscientos",    "dos-cents",     null),
        new NumberEntry(300,     "trescientos",   "tres-cents",    null),
        new NumberEntry(400,     "cuatrocientos", "quatre-cents",  null),
        new NumberEntry(500,     "quinientos",    "cinc-cents",    "Іспанська форма quinientos — неправильна."),
        new NumberEntry(600,     "seiscientos",   "sis-cents",     null),
        new NumberEntry(700,     "setecientos",   "set-cents",     "Іспанською setecientos, без i після set."),
        new NumberEntry(800,     "ochocientos",   "vuit-cents",    null),
        new NumberEntry(900,     "novecientos",   "nou-cents",     "Іспанською novecientos, не nuevecientos."),
        new NumberEntry(1000,    "mil",         "mil",          null),
        new NumberEntry(1000000, "un millón",   "un milió",     "Accent position differs: millón vs milió")
    );

    public List<NumberEntry> getAll() {
        return NUMBERS;
    }

    public Optional<NumberEntry> getByValue(int value) {
        return NUMBERS.stream().filter(n -> n.value() == value).findFirst();
    }
}
