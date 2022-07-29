import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponentService } from './app.component.service';
import { IDados } from './dados';
import { IDadosERP } from './dadosERP';
import { IDadosLote } from './dadosLote';
import { IDadosEmployee } from './dataEmployee';
import { IDadosLoteDB } from './IDadosLotesDB';

@ViewChild('rendererCanvas', {static: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  reposta: IDados[] = [];
  lotesDB : IDadosLoteDB[] = [];
  employees : IDadosEmployee[]=[];
  async ngOnInit(): Promise<void> {

    
    const service =  new AppComponentService(this.http);

          service.dataBaseData().subscribe({
            next : dados => {
             
            this.reposta = dados;

                service.dataERPDBLote().subscribe({
                  next : dadosdblote => {
                    this.lotesDB = dadosdblote;

                    service.dataERPEmployee().subscribe({
                      next : dadosEmployee => {
                        this.employees = dadosEmployee;

                          service.dataSensors().subscribe({
                            next : dadosChart => {
                              service.startAll(this.reposta,this.lotesDB,this.employees,dadosChart);
                            }
                          })

                        }
                      })
                      
                    }

                    })
                    

                  }
                })
  }
  title = 'DTInteraction';

  constructor(private http : HttpClient){

  } 


 


}