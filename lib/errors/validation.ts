import { ValidationError } from "./app-error"

/**
 * Validation utilities
 */

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format")
  }
}

export function validateUUID(id: string, fieldName = "ID"): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`)
  }
}

export function validateEnum<T>(value: any, allowedValues: T[], fieldName: string): void {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(`Invalid ${fieldName}. Allowed values: ${allowedValues.join(", ")}`, { allowedValues })
  }
}

export function validateRange(value: number, min: number, max: number, fieldName: string): void {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`, { min, max, value })
  }
}

export function validateObject(value: any, fieldName: string): void {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an object`)
  }
}

export function validateArray(value: any, fieldName: string): void {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`)
  }
}
