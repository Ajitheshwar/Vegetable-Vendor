import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(originalArray : any[], searchTerm : string): any[] {
    
    if(!originalArray || !searchTerm){
      return originalArray
    }
    else{
      return originalArray.filter((obj)=>{
        let name = obj.name
        
        return name.toLoweCase().indexOf(searchTerm.toLowerCase())!==-1
      })
    }
  }

}
