import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(number: number): string {
    let sign = true;
    if(number < 0){
      sign = false;
      number = -number
    }
    let a = []
    let x = number%1000
    let y = x.toString()
    if(y.length == 2) y = 0+y
    else if(y.length == 1) y = "00"+y
    a.unshift(y)
    number = Math.floor(number/1000)
    while(number%100 > 0){
        x = number%100
        y = x.toString()
        if(y.length == 1) y = 0+y
        a.unshift(y)
        number = Math.floor(number/100)
    }
    let result = a.join(',')
    if(result[0]=='0') result = result.substring(1)
    if(!sign) result = '-'+result
    return result
  }

}
