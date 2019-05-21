import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, field: string, input: string) {
    if (input !== undefined && input.length >= 2) {
      input = input.toLowerCase();
      if (typeof value[0] === 'string') {
        return value.filter(function(el: any) {
          return el.toLowerCase().indexOf(input) > -1;
        });
      }
      return value.filter(function(el: any) {
        return el[field].toLowerCase().indexOf(input) > -1;
      });
    }
    return value;
  }
}