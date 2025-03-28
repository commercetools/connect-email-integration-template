export const mockOrder = {
  type: 'Order',
  id: 'e19fc051-05ab-4618-9c93-bd34f18d1671',
  version: 1,
  versionModifiedAt: '2024-06-24T17:04:14.845Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2024-06-24T17:04:14.776Z',
  lastModifiedAt: '2024-06-24T17:04:14.776Z',
  lastModifiedBy: {
    isPlatformClient: true,
    user: { typeId: 'user', id: 'f85221c7-b423-4d0b-958c-4d6632273d71' }
  },
  createdBy: {
    isPlatformClient: true,
    user: { typeId: 'user', id: 'f85221c7-b423-4d0b-958c-4d6632273d71' }
  },
  customerId: '34beb7b1-fd02-4e35-a821-0525dcb79936',
  customerEmail: 'carolina.boninisalas@ariessolutions.io',
  customerGroup: {
    typeId: 'customer-group',
    id: '61fafb32-9b99-430b-a3a5-02a3466f2a5a'
  },
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 3050,
    fractionDigits: 2
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 3050,
      fractionDigits: 2
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 3050,
      fractionDigits: 2
    },
    taxPortions: [],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 0,
      fractionDigits: 2
    }
  },
  taxedShippingPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 500,
      fractionDigits: 2
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 500,
      fractionDigits: 2
    },
    taxPortions: [],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 0,
      fractionDigits: 2
    }
  },
  orderState: 'Open',
  syncInfo: [],
  returnInfo: [],
  taxMode: 'Platform',
  inventoryMode: 'None',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  origin: 'Merchant',
  shippingMode: 'Single',
  shippingInfo: {
    shippingMethodName: 'Standard Delivery',
    price: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 500,
      fractionDigits: 2
    },
    shippingRate: { price: {}, tiers: [] },
    taxRate: {
      name: 'nontax_usa',
      amount: 0,
      includedInPrice: true,
      country: 'US',
      id: 'fJkfR08O',
      subRates: []
    },
    taxCategory: {
      typeId: 'tax-category',
      id: '1871d2eb-c64e-4d59-b9ce-d0400fad3daa'
    },
    deliveries: [],
    shippingMethod: {
      typeId: 'shipping-method',
      id: '756f2465-fdb1-4d4b-97bc-439810b8e3cd'
    },
    taxedPrice: {
      totalNet: {},
      totalGross: {},
      taxPortions: [],
      totalTax: {}
    },
    shippingMethodState: 'MatchesCart'
  },
  shippingAddress: {
    id: 'qzRAUJPz',
    firstName: 'Carolina',
    lastName: 'Bonini',
    streetName: 'Lincoln Road',
    streetNumber: '1234',
    postalCode: '33166',
    city: 'Miami',
    state: '',
    country: 'US',
    company: 'Aries Solutions',
    apartment: '',
    phone: '305 456-6247',
    email: 'carolina.boninisalas@ariessolutions.io'
  },
  shipping: [],
  discountTypeCombination: { type: 'Stacking' },
  lineItems: [
    {
      id: 'bad3c4e9-9009-4481-9c03-e646d1a81d60',
      productId: '64a8e5f5-8c1c-4ee4-afc5-28fcda445d3d',
      productKey: 'lip-1',
      name: { en: 'Lipstick' },
      productType: { typeId: 'product-type', id: '123' },
      productSlug: { en: 'lipstick' },
      variant: { id: 1 },
      price: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 1000,
        fractionDigits: 2
      },
      quantity: 3,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'nontax_usa',
        amount: 0,
        includedInPrice: true,
        country: 'US',
        id: 'fJkfR08O',
        subRates: []
      },
      perMethodTaxRate: [],
      addedAt: '2024-06-24T17:04:05.545Z',
      lastModifiedAt: '2024-06-24T17:04:05.545Z',
      state: [{ quantity: 3 }],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 3000,
        fractionDigits: 2
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 3000,
          fractionDigits: 2
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 3000,
          fractionDigits: 2
        },
        taxPortions: [],
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 0,
          fractionDigits: 2
        }
      },
      taxedPricePortions: []
    }
  ],
  customLineItems: [],
  transactionFee: true,
  discountCodes: [],
  directDiscounts: [],
  cart: { typeId: 'cart', id: '48255cbd-426e-4fea-b2a1-de3c08ce478b' },
  billingAddress: {
    id: 'qzRAUJPz',
    firstName: 'Carolina',
    lastName: 'Bonini',
    streetName: 'Lincoln Road',
    streetNumber: '1234',
    postalCode: '33166',
    city: 'Miami',
    state: '',
    country: 'US',
    company: 'Aries Solutions',
    apartment: '',
    phone: '305 456-6247',
    email: 'carolina.boninisalas@ariessolutions.io'
  },
  itemShippingAddresses: [],
  refusedGifts: []
}; 