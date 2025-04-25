import { formatCurrency } from '../../scripts/utils/money.js' 

describe('test suite: formatCurrency', () => {
  it('checks if function is working correctly', ()=>{
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  it('checks if function is working correctly with 0', ()=>{
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('checks if function rounds off correctly', ()=>{
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });

  it('exercise 16a', () => {
    expect(formatCurrency(2000.4)).toEqual('20.00');
  });

  it('excercise 16b', () => {
    expect(formatCurrency(-12.5)).toEqual("-0.12")
  })


});