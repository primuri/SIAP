# -*- coding: utf-8 -*-
"""
Created on Sun Oct 22 00:12:04 2023

@author: Brandon Castillo Badilla
Cedula: 118240782
"""


import math
import numpy as np
import pandas as pd

class Circulo:
    def __init__(self, radio):
        self.__radio = radio
    
    @property
    def radio(self) -> float:
        return self.__radio
    
    @radio.setter
    def radio(self, radio: float):
        if radio < 0:
            raise ValueError("El radio no puede ser negativo")
        self.__radio = radio

    def perimetro(self) -> float:
        return 2 * math.pi * self.__radio
    
    def area(self) -> float:
        return math.pi * (self.__radio**2)
    
    def __str__(self):
        return f"El círculo tiene un radio de {self.__radio:.2f}"

class Rombo:
    def __init__(self, lado, diagonal_superior, diagonal_inferior):
        self.__lado = lado
        self.__diagonal_superior = diagonal_superior
        self.__diagonal_inferior = diagonal_inferior

    @property
    def lado(self):
        return self.__lado

    @lado.setter
    def lado(self, valor):
        self.__lado = valor

    @property
    def diagonal_superior(self):
        return self.__diagonal_superior

    @diagonal_superior.setter
    def diagonal_superior(self, valor):
        self.__diagonal_superior = valor

    @property
    def diagonal_inferior(self):
        return self.__diagonal_inferior

    @diagonal_inferior.setter
    def diagonal_inferior(self, valor):
        self.__diagonal_inferior = valor

    def perimetro(self):
        return 4 * self.__lado

    def area(self):
        return 0.5 * self.__diagonal_superior * self.__diagonal_inferior

    def __str__(self):
        return f"El lado del rombo mide {self.__lado}, la diagonal superior mide {self.__diagonal_superior} y la diagonal inferior mide {self.__diagonal_inferior}"


class Operacion:
    def __init__(self, u, v):
        if len(u) != len(v):
            raise ValueError("Los vectores deben tener el mismo tamaño")
        self.__u = u
        self.__v = v

    @property
    def u(self):
        return self.__u

    @u.setter
    def u(self, valor):
        self.__u = valor

    @property
    def v(self):
        return self.__v

    @v.setter
    def v(self, valor):
        self.__v = valor

    def sumar(self):
        return [ui + vi for ui, vi in zip(self.__u, self.__v)]

    def restar(self):
        return [ui - vi for ui, vi in zip(self.__u, self.__v)]

    def producto_punto(self):
        return sum(ui * vi for ui, vi in zip(self.__u, self.__v))

    def covarianza(self):
        return np.cov(self.__u, self.__v)[0][1]

    def correlacion(self):
        return np.corrcoef(self.__u, self.__v)[0][1]

    def __str__(self):
        return f"Vectores: u={self.__u}, v={self.__v}"
    
class TablaDatos:
    def __init__(self, dataframe):
        self.__df = dataframe

    @property
    def df(self):
        return self.__df

    @df.setter
    def df(self, valor):
        if isinstance(valor, pd.DataFrame):
            self.__df = valor
        else:
            raise ValueError("El valor asignado debe ser un DataFrame de pandas")

    def __variables_categoricas(self):
        return self.__df.select_dtypes(include=['object']).columns.tolist()

    def __variables_numericas(self):
        return self.__df.select_dtypes(include=['number']).columns.tolist()

    def resumen_columnas(self):
        resumen = {}
        categoricas = self.__variables_categoricas()
        numericas = self.__variables_numericas()

        for col in categoricas:
            resumen[col] = self.__df[col].mode().iloc[0]

        for col in numericas:
            resumen[col] = self.__df[col].mean()

        return resumen

    def calculo_correlacion(self, col_num1, col_num2):
        if col_num1 in self.__variables_categoricas() or col_num2 in self.__variables_categoricas():
            return {"error": "Una de las columnas es categórica y no se puede calcular la correlación"}
        
        correlacion = self.__df[col_num1].corr(self.__df[col_num2])
        return {"columna1": col_num1, "columna2": col_num2, "correlacion": correlacion}

    def renombrar_columnas(self, nuevo_nombre, posicion):
        columnas = self.__df.columns.tolist()
        if posicion < len(columnas):
            columnas[posicion] = nuevo_nombre
            self.__df.columns = columnas

    def eliminar_fila(self, fila_num):
        self.__df.drop(fila_num, inplace=True, axis=0)

    def __str__(self):
        return str(self.__df.head())