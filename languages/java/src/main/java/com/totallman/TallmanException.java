package com.totallman;

/** Thrown when an unknown Tall Man list ID is requested. */
public class TallmanException extends RuntimeException {
  public TallmanException(String message) {
    super(message);
  }
}
