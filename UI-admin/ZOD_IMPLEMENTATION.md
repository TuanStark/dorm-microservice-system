# Zod Form Validation Implementation

## Overview
This document describes the implementation of Zod form validation throughout the UI-admin project. All forms now use Zod schemas for robust client-side validation with TypeScript support.

## Files Added/Modified

### New Files
1. **`src/lib/validations.ts`** - Comprehensive Zod schemas for all form validations
2. **`src/hooks/useFormValidation.ts`** - Custom React hook for form validation

### Updated Files
1. **`src/pages/auth/LoginPage.tsx`** - Updated to use Zod validation
2. **`src/pages/auth/RegisterPage.tsx`** - Updated to use Zod validation
3. **`src/pages/buildings/BuildingsPage.tsx`** - Updated to use Zod validation
4. **`src/pages/rooms/RoomsPage.tsx`** - Updated to use Zod validation
5. **`src/pages/users/UsersPage.tsx`** - Updated to use Zod validation
6. **`src/pages/settings/SettingsPage.tsx`** - Updated to use Zod validation

## Validation Schemas

### Auth Schemas
- **`loginSchema`** - Email and password validation for login
- **`registerSchema`** - Complete registration validation with password confirmation

### Building Schemas
- **`buildingSchema`** - Building creation/editing validation

### Room Schemas
- **`roomSchema`** - Room creation/editing validation

### User Schemas
- **`userSchema`** - User creation/editing validation

### Profile Schemas
- **`profileUpdateSchema`** - Profile information update validation
- **`passwordUpdateSchema`** - Password change validation

### System Settings Schemas
- **`systemSettingsSchema`** - System configuration validation

### Additional Schemas
- **`bookingSchema`** - Booking creation validation
- **`reviewSchema`** - Review submission validation
- **`searchSchema`** - Search form validation

## Features Implemented

### 1. Type Safety
- All form data is now strongly typed using TypeScript
- Zod schemas provide runtime validation with compile-time type inference

### 2. Comprehensive Validation Rules
- **Email validation** - Proper email format checking
- **Password validation** - Strong password requirements (uppercase, lowercase, numbers)
- **Length validation** - Min/max length constraints for all text fields
- **Number validation** - Range validation for numeric inputs
- **Enum validation** - Proper selection validation for dropdowns
- **Custom validation** - Password confirmation matching

### 3. User Experience
- **Real-time validation** - Errors clear as user types
- **Visual feedback** - Red borders and error messages for invalid fields
- **Comprehensive error messages** - Clear, localized error messages in Vietnamese

### 4. Custom Hook
- **`useFormValidation`** - Reusable hook for form validation
- **Error management** - Clear, set, and field-specific error handling
- **Validation state** - Easy access to validation status

## Usage Examples

### Basic Form with Validation
```typescript
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useFormValidation } from '@/hooks/useFormValidation';

const MyForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const { errors, validate, clearFieldError } = useFormValidation(loginSchema);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    // Handle form submission
  };
  
  // ... rest of component
};
```

### Input with Error Display
```typescript
<Input
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
/>
{errors.email && (
  <p className="text-sm text-red-600">{errors.email}</p>
)}
```

## Validation Rules

### Email Validation
- Required field
- Must be valid email format

### Password Validation
- **Login**: Minimum 6 characters
- **Registration/Update**: Minimum 8 characters with uppercase, lowercase, and numbers

### Name Validation
- Required field
- Minimum 2 characters
- Maximum 100 characters

### Number Validation
- **Room capacity**: 1-10 people
- **Room price**: 0-$10,000
- **Building capacity**: 1-10,000

### Text Length Validation
- **Room number**: 2-20 characters
- **Address**: 5-200 characters
- **Description**: Maximum 500 characters

## Benefits

1. **Type Safety** - Compile-time error checking
2. **Runtime Validation** - Client-side validation before submission
3. **Consistent UX** - Uniform validation behavior across all forms
4. **Maintainable** - Centralized validation logic
5. **Extensible** - Easy to add new validation rules
6. **Localized** - All error messages in Vietnamese
7. **Performance** - Efficient validation with minimal re-renders

## Dependencies Added
- **zod** - Schema validation library

## Future Enhancements
- Server-side validation integration
- Async validation for unique fields (email, room number)
- Custom validation rules for business logic
- Form field dependencies validation
- Multi-step form validation
