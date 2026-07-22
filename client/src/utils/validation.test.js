import test from 'node:test';
import assert from 'node:assert/strict';

import { validateStep } from './validation.js';

test('validateStep requires declarations for the consent step', () => {
  const invalidForm = {
    firstName: 'John',
    lastName: 'Doe',
    dob: '2010-01-01',
    gender: 'Male',
    mobile: '9876543210',
    email: 'john@example.com',
    guardianName: 'Jane Doe',
    guardianMobile: '9876543211',
    guardianRelation: 'Mother',
    addressLine: '1 Main Street',
    city: 'Mumbai',
    state: 'MH',
    pinCode: '400001',
    competitionApplied: 'Athletics',
    age: 15,
    declarationConfirmed: false,
    termsAccepted: false,
    parentConsent: false,
  };

  assert.equal(validateStep(7, invalidForm), 'Please confirm the declaration and consent terms');
});

test('validateStep requires a payment selection before submission', () => {
  const invalidForm = {
    firstName: 'John',
    lastName: 'Doe',
    dob: '2000-01-01',
    gender: 'Male',
    mobile: '9876543210',
    email: 'john@example.com',
    guardianName: 'Jane Doe',
    guardianMobile: '9876543211',
    guardianRelation: 'Mother',
    addressLine: '1 Main Street',
    city: 'Mumbai',
    state: 'MH',
    pinCode: '400001',
    competitionApplied: 'Athletics',
    age: 24,
    declarationConfirmed: true,
    termsAccepted: true,
    parentConsent: true,
    paymentStatus: 'pending',
  };

  assert.equal(validateStep(8, invalidForm), 'Please complete the payment step');
});
