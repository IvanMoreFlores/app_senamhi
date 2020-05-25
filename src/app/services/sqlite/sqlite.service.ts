import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  database: SQLiteObject;
  constructor(public sqlite: SQLite) {
  }

  /// -------- Creación de la BASE DE DATOS  --------  ///
  createBD() {
    return this.sqlite.create({ name: 'SC_VOZYDATA.db', location: 'default' }).then((db: SQLiteObject) => {
      this.database = db;
      console.log('Se creo correctamente la BD :');
      this.createTableEstacion();
      this.createTableNumero();
      this.createTableHora();
      this.createTableParametro();
      this.createTableDeficit();
      this.createTableNube();
      this.createTableViento();
      this.createTableUmbrales();
      this.createTableIncidencia();
      this.createTableOcurrencia();
      this.createTableParaEvento();
      this.createTableEvento_x_para();
      this.createTableING_MOVIL_WEB();
      this.createTableING_EVENTO_MOV_WEB();
      this.createTableING_AFORO_MOV_WEB();
      return Promise.resolve(true);
    }, (error) => {
      return Promise.reject(error);
    });
  }

  /// ---------------------------------------------  ///

  /// ----------- ELIMINACIÓN DE LA BD ------------  ///
  deleteDB() {
    this.sqlite.deleteDatabase({ name: 'SC_VOZYDATA.db', location: 'default' }).then((result) => {
      console.log('Se eliminó correctamente la BD');
    }).catch((err) => {
      console.log('ERROR: ', err);
    });
  }
  /// ---------------------------------------------  ///

  /// -------- Creación de la tabla SIMENH_CONFIG_SOPORTE_MOVIL  --------  ///
  createTableNumero() {
    console.log('Se creo la tabla SIMENH_CONFIG_SOPORTE_MOVIL');
    return this.database.executeSql('create table if not exists SIMENH_CONFIG_SOPORTE_MOVIL( NUMERO TEXT, RESPONSABLE TEXT, FLAG_TIPO TEXT)', []);
  }

  addNumero(Incidencia: { NUMERO: any; RESPONSABLE: any; FLAG_TIPO: any }) {
    const sql = 'INSERT INTO SIMENH_CONFIG_SOPORTE_MOVIL (NUMERO, RESPONSABLE, FLAG_TIPO) values (?,?,?)';
    return this.database.executeSql(sql, [Incidencia.NUMERO, Incidencia.RESPONSABLE, Incidencia.FLAG_TIPO]);
  }

  countNumero() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_CONFIG_SOPORTE_MOVIL';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getNumero(FLAG_TIPO) {
    const sql = 'SELECT * FROM SIMENH_CONFIG_SOPORTE_MOVIL  WHERE FLAG_TIPO=?';
    return this.database.executeSql(sql, [FLAG_TIPO]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            NUMERO: data.rows.item(i).NUMERO,
            RESPONSABLE: data.rows.item(i).RESPONSABLE,
            FLAG_TIPO: data.rows.item(i).FLAG_TIPO,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// --------------------------------------------------------  ///

  /// -------- Creación de la tabla SIMENH_INCIDENCIA  --------  ///
  createTableIncidencia() {
    console.log('Se creo la tabla SIMENH_INCIDENCIA');
    return this.database.executeSql('create table if not exists SIMENH_INCIDENCIA( ID_INCIDENCIA TEXT, DESC_INCIDENCIA TEXT, COD_TIPO_INCI TEXT, ABREV_INCI TEXT )', []);
  }

  addIncidencia(Incidencia: { ID_INCIDENCIA: any; DESC_INCIDENCIA: any; COD_TIPO_INCI: any; ABREV_INCI: any; }) {
    const sql = 'INSERT INTO SIMENH_INCIDENCIA (ID_INCIDENCIA, DESC_INCIDENCIA, COD_TIPO_INCI, ABREV_INCI) values (?,?,?,?)';
    return this.database.executeSql(sql, [Incidencia.ID_INCIDENCIA, Incidencia.DESC_INCIDENCIA, Incidencia.COD_TIPO_INCI, Incidencia.ABREV_INCI]);
  }

  countIncidencia() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_INCIDENCIA';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getIncidencia(COD_TIPO_INCI) {
    const sql = 'SELECT * FROM SIMENH_INCIDENCIA  WHERE COD_TIPO_INCI=?';
    return this.database.executeSql(sql, [COD_TIPO_INCI]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_INCIDENCIA: data.rows.item(i).ID_INCIDENCIA,
            DESC_INCIDENCIA: data.rows.item(i).DESC_INCIDENCIA,
            COD_TIPO_INCI: data.rows.item(i).COD_TIPO_INCI,
            ABREV_INCI: data.rows.item(i).ABREV_INCI,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_ESTACION  --------  ///

  createTableEstacion() {
    console.log('Se creo la tabla SIMENH_ESTACION');
    return this.database.executeSql('create table if not exists SIMENH_ESTACION( V_COD_ESTA TEXT, V_NOM_ESTA TEXT, V_COD_TIPO TEXT, DESC_TIPO_ESTA TEXT )', []);
  }

  addEstacion(Estacion: { V_COD_ESTA: any; V_NOM_ESTA: any; V_COD_TIPO: any; DESC_TIPO_ESTA: any; }) {
    const sql = 'INSERT INTO SIMENH_ESTACION (V_COD_ESTA, V_NOM_ESTA, V_COD_TIPO, DESC_TIPO_ESTA) values (?,?,?,?)';
    return this.database.executeSql(sql, [Estacion.V_COD_ESTA, Estacion.V_NOM_ESTA, Estacion.V_COD_TIPO, Estacion.DESC_TIPO_ESTA]);
  }

  countEstacion() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_ESTACION';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getEstacion() {
    const sql = 'SELECT * FROM SIMENH_ESTACION';
    return this.database.executeSql(sql, []).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            V_NOM_ESTA: data.rows.item(i).V_NOM_ESTA,
            V_COD_TIPO: data.rows.item(i).V_COD_TIPO,
            DESC_TIPO_ESTA: data.rows.item(i).DESC_TIPO_ESTA,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getEstacionId(V_COD_ESTA: String) {
    const sql = 'SELECT * FROM SIMENH_ESTACION WHERE V_COD_ESTA=' + V_COD_ESTA + '';
    return this.database.executeSql(sql, []).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            V_NOM_ESTA: data.rows.item(i).V_NOM_ESTA,
            V_COD_TIPO: data.rows.item(i).V_COD_TIPO,
            DESC_TIPO_ESTA: data.rows.item(i).DESC_TIPO_ESTA,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_HORA_SINOPTICA  --------  ///

  createTableHora() {
    console.log('Se creo la tabla SIMENH_HORA_SINOPTICA');
    return this.database.executeSql('create table if not exists SIMENH_HORA_SINOPTICA( ID_HORA_SINOPTICA TEXT, COD_DET_SH TEXT, DESC_HORA_SINOP TEXT, COD_TIPO_ESTA TEXT )', []);
  }

  addHora(Hora: { ID_HORA_SINOPTICA: any; COD_DET_SH: any; DESC_HORA_SINOP: any; COD_TIPO_ESTA: any; }) {
    const sql = 'INSERT INTO SIMENH_HORA_SINOPTICA (ID_HORA_SINOPTICA, COD_DET_SH, DESC_HORA_SINOP, COD_TIPO_ESTA) values (?,?,?,?)';
    return this.database.executeSql(sql, [Hora.ID_HORA_SINOPTICA, Hora.COD_DET_SH, Hora.DESC_HORA_SINOP, Hora.COD_TIPO_ESTA]);
  }

  countHora(COD_TIPO_ESTA) {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_HORA_SINOPTICA WHERE COD_TIPO_ESTA = ?';
    return this.database.executeSql(sql, [COD_TIPO_ESTA]).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getHora(COD_TIPO_ESTA) {
    const sql = 'SELECT * FROM SIMENH_HORA_SINOPTICA WHERE COD_TIPO_ESTA = ?';
    return this.database.executeSql(sql, [COD_TIPO_ESTA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            COD_DET_SH: data.rows.item(i).COD_DET_SH,
            DESC_HORA_SINOP: data.rows.item(i).DESC_HORA_SINOP,
            COD_TIPO_ESTA: data.rows.item(i).COD_TIPO_ESTA,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_PARAM_X_ESTACION  --------  ///

  createTableParametro() {
    console.log('Se creo la tabla SIMENH_PARAM_X_ESTACION');
    return this.database.executeSql('create table if not exists SIMENH_PARAM_X_ESTACION( V_COD_ESTA TEXT, ID_HORA_SINOPTICA TEXT, C_COD_PARAG TEXT, C_COD_CORRP TEXT, V_NOM_PARA TEXT, C_COD_PARAT TEXT, C_TIP_DATO TEXT, I_DEC_PARA TEXT, V_NOC_PARA TEXT, FLG_INPUT NUMBER,COD_PARAM TEXT)', []);
  }

  addParametro(Parametro: { V_COD_ESTA: any; ID_HORA_SINOPTICA: any; C_COD_PARAG: any; C_COD_CORRP: any; V_NOM_PARA: any; C_COD_PARAT: any; C_TIP_DATO: any; I_DEC_PARA: any; V_NOC_PARA: any; FLG_INPUT: any; COD_PARAM: any }) {
    const sql = 'INSERT INTO SIMENH_PARAM_X_ESTACION (V_COD_ESTA, ID_HORA_SINOPTICA, C_COD_PARAG, C_COD_CORRP, V_NOM_PARA, C_COD_PARAT, C_TIP_DATO, I_DEC_PARA, V_NOC_PARA, FLG_INPUT,COD_PARAM) values (?,?,?,?,?,?,?,?,?,?,?)';
    return this.database.executeSql(sql, [Parametro.V_COD_ESTA, Parametro.ID_HORA_SINOPTICA, Parametro.C_COD_PARAG, Parametro.C_COD_CORRP, Parametro.V_NOM_PARA, Parametro.C_COD_PARAT, Parametro.C_TIP_DATO, Parametro.I_DEC_PARA, Parametro.V_NOC_PARA, Parametro.FLG_INPUT, Parametro.COD_PARAM]);
  }

  countParametro(V_COD_ESTA) {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_PARAM_X_ESTACION WHERE V_COD_ESTA = ?';
    return this.database.executeSql(sql, [V_COD_ESTA]).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getParametro(V_COD_ESTA, ID_HORA_SINOPTICA) {
    const sql = 'SELECT * FROM SIMENH_PARAM_X_ESTACION WHERE V_COD_ESTA = ? AND ID_HORA_SINOPTICA = ?';
    return this.database.executeSql(sql, [V_COD_ESTA, ID_HORA_SINOPTICA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            V_NOM_PARA: data.rows.item(i).V_NOM_PARA,
            C_COD_PARAT: data.rows.item(i).C_COD_PARAT,
            C_TIP_DATO: data.rows.item(i).C_TIP_DATO,
            I_DEC_PARA: data.rows.item(i).I_DEC_PARA,
            V_NOC_PARA: data.rows.item(i).V_NOC_PARA,
            FLG_INPUT: data.rows.item(i).FLG_INPUT,
            COD_PARAM: data.rows.item(i).COD_PARAM,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getParametroId(COD_PARAM) {
    const sql = 'SELECT * FROM SIMENH_PARAM_X_ESTACION WHERE COD_PARAM = ?';
    return this.database.executeSql(sql, [COD_PARAM]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            V_NOM_PARA: data.rows.item(i).V_NOM_PARA,
            C_COD_PARAT: data.rows.item(i).C_COD_PARAT,
            C_TIP_DATO: data.rows.item(i).C_TIP_DATO,
            I_DEC_PARA: data.rows.item(i).I_DEC_PARA,
            V_NOC_PARA: data.rows.item(i).V_NOC_PARA,
            FLG_INPUT: data.rows.item(i).FLG_INPUT,
            COD_PARAM: data.rows.item(i).COD_PARAM,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_DEFICINSTRU  --------  ///

  createTableDeficit() {
    console.log('Se creo la tabla SIMENH_DEFICINSTRU');
    return this.database.executeSql('create table if not exists SIMENH_DEFICINSTRU( ID_DEFICIENCIA TEXT, V_NOM_DEFICINSTR TEXT, C_COD_PARAG TEXT, TIPO_ESTA TEXT, ID_ESTADO TEXT, C_COD_CORRP TEXT)', []);
  }

  addDeficit(Deficit: { ID_DEFICIENCIA: any; V_NOM_DEFICINSTR: any; C_COD_PARAG: any; TIPO_ESTA: any; ID_ESTADO: any; C_COD_CORRP: any }) {
    const sql = 'INSERT INTO SIMENH_DEFICINSTRU (ID_DEFICIENCIA, V_NOM_DEFICINSTR, C_COD_PARAG, TIPO_ESTA, ID_ESTADO, C_COD_CORRP ) values (?,?,?,?,?,?)';
    return this.database.executeSql(sql, [Deficit.ID_DEFICIENCIA, Deficit.V_NOM_DEFICINSTR, Deficit.C_COD_PARAG, Deficit.TIPO_ESTA, Deficit.ID_ESTADO, Deficit.C_COD_CORRP]);
  }

  countDeficit() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_DEFICINSTRU';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getDeficit(C_COD_PARAG, C_COD_CORRP) {
    const sql = 'SELECT * FROM SIMENH_DEFICINSTRU WHERE C_COD_PARAG=? AND C_COD_CORRP= ?';
    return this.database.executeSql(sql, [C_COD_PARAG, C_COD_CORRP]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_DEFICIENCIA: data.rows.item(i).ID_DEFICIENCIA,
            V_NOM_DEFICINSTR: data.rows.item(i).V_NOM_DEFICINSTR,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            TIPO_ESTA: data.rows.item(i).TIPO_ESTA,
            ID_ESTADO: data.rows.item(i).ID_ESTADO,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_TIPO_NUBE_X_PARAM  --------  ///

  createTableNube() {
    console.log('Se creo la tabla SIMENH_TIPO_NUBE_X_PARAM');
    return this.database.executeSql('create table if not exists SIMENH_TIPO_NUBE_X_PARAM( ID_ALTITUD TEXT, SIMBOLO TEXT, VALOR TEXT, C_COD_PARAG TEXT, C_COD_CORRP TEXT, DESC_ALTITUD TEXT, DESC_TIPO_NUBE TEXT )', []);
  }

  addNube(Nube: { ID_ALTITUD: any; SIMBOLO: any; VALOR: any; C_COD_PARAG: any; C_COD_CORRP: any; DESC_ALTITUD: any; DESC_TIPO_NUBE: any }) {
    const sql = 'INSERT INTO SIMENH_TIPO_NUBE_X_PARAM (ID_ALTITUD, SIMBOLO, VALOR, C_COD_PARAG, C_COD_CORRP, DESC_ALTITUD, DESC_TIPO_NUBE) values (?,?,?,?,?,?,?)';
    return this.database.executeSql(sql, [Nube.ID_ALTITUD, Nube.SIMBOLO, Nube.VALOR, Nube.C_COD_PARAG, Nube.C_COD_CORRP, Nube.DESC_ALTITUD, Nube.DESC_TIPO_NUBE]);
  }

  countNube() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_TIPO_NUBE_X_PARAM';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getNube(C_COD_PARAG, C_COD_CORRP) {
    const sql = 'SELECT * FROM SIMENH_TIPO_NUBE_X_PARAM WHERE C_COD_PARAG = ? AND C_COD_CORRP = ?';
    return this.database.executeSql(sql, [C_COD_PARAG, C_COD_CORRP]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_ALTITUD: data.rows.item(i).ID_ALTITUD,
            SIMBOLO: data.rows.item(i).SIMBOLO,
            VALOR: data.rows.item(i).VALOR,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            DESC_ALTITUD: data.rows.item(i).DESC_ALTITUD,
            DESC_TIPO_NUBE: data.rows.item(i).DESC_TIPO_NUBE,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getNubeValor(VALOR) {
    const sql = 'SELECT * FROM SIMENH_TIPO_NUBE_X_PARAM WHERE VALOR = ? LIMIT 1';
    return this.database.executeSql(sql, [VALOR]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_ALTITUD: data.rows.item(i).ID_ALTITUD,
            SIMBOLO: data.rows.item(i).SIMBOLO,
            VALOR: data.rows.item(i).VALOR,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            DESC_ALTITUD: data.rows.item(i).DESC_ALTITUD,
            DESC_TIPO_NUBE: data.rows.item(i).DESC_TIPO_NUBE,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_DIRECC_VIENTO  --------  ///

  createTableViento() {
    console.log('Se creo la tabla SIMENH_DIRECC_VIENTO');
    return this.database.executeSql('create table if not exists SIMENH_DIRECC_VIENTO( DIRECCION_ABRV TEXT, DESCRIPCION TEXT, GRADO TEXT )', []);
  }

  addViento(Viento: { DIRECCION_ABRV: any; DESCRIPCION: any; GRADO: any }) {
    const sql = 'INSERT INTO SIMENH_DIRECC_VIENTO (DIRECCION_ABRV, DESCRIPCION, GRADO) values (?,?,?)';
    return this.database.executeSql(sql, [Viento.DIRECCION_ABRV, Viento.DESCRIPCION, Viento.GRADO]);
  }

  countViento() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_DIRECC_VIENTO';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getViento() {
    const sql = 'SELECT * FROM SIMENH_DIRECC_VIENTO';
    return this.database.executeSql(sql, []).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            DIRECCION_ABRV: data.rows.item(i).DIRECCION_ABRV,
            DESCRIPCION: data.rows.item(i).DESCRIPCION,
            GRADO: data.rows.item(i).GRADO,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getVientoValor(GRADO) {
    const sql = 'SELECT * FROM SIMENH_DIRECC_VIENTO WHERE GRADO=?';
    return this.database.executeSql(sql, [GRADO]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            DIRECCION_ABRV: data.rows.item(i).DIRECCION_ABRV,
            DESCRIPCION: data.rows.item(i).DESCRIPCION,
            GRADO: data.rows.item(i).GRADO,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_UMBRALES_PARAM  --------  ///

  createTableUmbrales() {
    console.log('Se creo la tabla SIMENH_UMBRALES_PARAM');
    return this.database.executeSql('create table if not exists SIMENH_UMBRALES_PARAM( C_COD_PARAG TEXT, C_COD_CORRP TEXT, LIMIT_INFERIOR TEXT, LIMIT_SUPERIOR TEXT, UNIDAD TEXT, DESCRIPCION TEXT, CODIGO TEXT )', []);
  }

  addUmbrales(Umbrales: { C_COD_PARAG: any; C_COD_CORRP: any; LIMIT_INFERIOR: any; LIMIT_SUPERIOR: any; UNIDAD: any; DESCRIPCION: any; CODIGO: any }) {
    const sql = 'INSERT INTO SIMENH_UMBRALES_PARAM (C_COD_PARAG, C_COD_CORRP, LIMIT_INFERIOR, LIMIT_SUPERIOR, UNIDAD, DESCRIPCION, CODIGO) values (?,?,?,?,?,?,?)';
    return this.database.executeSql(sql, [Umbrales.C_COD_PARAG, Umbrales.C_COD_CORRP, Umbrales.LIMIT_INFERIOR, Umbrales.LIMIT_SUPERIOR, Umbrales.UNIDAD, Umbrales.DESCRIPCION, Umbrales.CODIGO]);
  }

  countUmbrales() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_UMBRALES_PARAM';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getUmbrales(CODIGO) {
    const sql = 'SELECT * FROM SIMENH_UMBRALES_PARAM WHERE CODIGO = ?';
    return this.database.executeSql(sql, [CODIGO]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            LIMIT_INFERIOR: data.rows.item(i).LIMIT_INFERIOR,
            LIMIT_SUPERIOR: data.rows.item(i).LIMIT_SUPERIOR,
            UNIDAD: data.rows.item(i).UNIDAD,
            DESCRIPCION: data.rows.item(i).DESCRIPCION,
            CODIGO: data.rows.item(i).CODIGO,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Eliminar todas las tablas LOCALES --------  ///

  deleteTable(table) {
    return this.database.executeSql('DELETE FROM ' + table, []);
  }

  /// -------- Creación de la tabla SIMENH_OCURRENCIA  --------  ///
  createTableOcurrencia() {
    console.log('Se creo la tabla SIMENH_OCURRENCIA');
    return this.database.executeSql('create table if not exists SIMENH_OCURRENCIA( C_COR_OCURRE TEXT, V_DES_OCURRE TEXT )', []);
  }

  addOcurrencia(Ocurrencia: { C_COR_OCURRE: any; V_DES_OCURRE: any }) {
    const sql = 'INSERT INTO SIMENH_OCURRENCIA (C_COR_OCURRE, V_DES_OCURRE) values (?,?)';
    return this.database.executeSql(sql, [Ocurrencia.C_COR_OCURRE, Ocurrencia.V_DES_OCURRE]);
  }

  countOcurrencia() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_OCURRENCIA';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getOcurrencia() {
    const sql = 'SELECT * FROM SIMENH_OCURRENCIA';
    return this.database.executeSql(sql, []).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            C_COR_OCURRE: data.rows.item(i).C_COR_OCURRE,
            V_DES_OCURRE: data.rows.item(i).V_DES_OCURRE,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_PARAEVENTO  --------  ///
  createTableParaEvento() {
    console.log('Se creo la tabla SIMENH_PARAEVENTO');
    return this.database.executeSql('create table if not exists SIMENH_PARAEVENTO( C_COR_PAREVE TEXT, V_DES_PAREVEN TEXT )', []);
  }

  addParaEvento(ParaEvento: { C_COR_PAREVE: any; V_DES_PAREVEN: any }) {
    const sql = 'INSERT INTO SIMENH_PARAEVENTO (C_COR_PAREVE, V_DES_PAREVEN) values (?,?)';
    return this.database.executeSql(sql, [ParaEvento.C_COR_PAREVE, ParaEvento.V_DES_PAREVEN]);
  }

  countParaEvento() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_PARAEVENTO';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getParaEvento() {
    const sql = 'SELECT * FROM SIMENH_PARAEVENTO';
    return this.database.executeSql(sql, []).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            C_COR_PAREVE: data.rows.item(i).C_COR_PAREVE,
            V_DES_PAREVEN: data.rows.item(i).V_DES_PAREVEN,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla VIEW_EVENTO_X_OCURRENCIA  --------  ///

  createTableEvento_x_para() {
    console.log('Se creo la tabla SIMENH_EVENTO_X_OCURRENCIA');
    return this.database.executeSql('create table if not exists SIMENH_EVENTO_X_OCURRENCIA( C_COR_PAREVE TEXT, C_COR_OCURRE TEXT, C_IDE_ORDEN TEXT, C_COD_PARAG TEXT, C_COD_CORRP TEXT, V_NOM_PARA TEXT     )', []);
  }

  addEvento_x_para(Evento_x_para: { C_COR_PAREVE: any; C_COR_OCURRE: any; C_IDE_ORDEN: any; C_COD_PARAG: any; C_COD_CORRP: any; V_NOM_PARA: any }) {
    const sql = 'INSERT INTO SIMENH_EVENTO_X_OCURRENCIA (C_COR_PAREVE, C_COR_OCURRE,C_IDE_ORDEN,C_COD_PARAG,C_COD_CORRP,V_NOM_PARA) values (?,?,?,?,?,?)';
    return this.database.executeSql(sql, [Evento_x_para.C_COR_PAREVE, Evento_x_para.C_COR_OCURRE, Evento_x_para.C_IDE_ORDEN, Evento_x_para.C_COD_PARAG, Evento_x_para.C_COD_CORRP, Evento_x_para.V_NOM_PARA]);
  }

  countEvento_x_para() {
    const sql = 'SELECT count(*) AS cantidad FROM SIMENH_EVENTO_X_OCURRENCIA';
    return this.database.executeSql(sql, []).then((data) => {
      return Promise.resolve(data.rows.item(0).cantidad);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getEvento_x_para(C_COR_PAREVE, C_COR_OCURRE) {
    const sql = 'SELECT * FROM SIMENH_EVENTO_X_OCURRENCIA WHERE C_COR_PAREVE= ? AND C_COR_OCURRE= ?';
    return this.database.executeSql(sql, [C_COR_PAREVE, C_COR_OCURRE]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            C_COR_PAREVE: data.rows.item(i).C_COR_PAREVE,
            C_COR_OCURRE: data.rows.item(i).C_COR_OCURRE,
            C_IDE_ORDEN: data.rows.item(i).C_IDE_ORDEN,
            C_COD_PARAG: data.rows.item(i).C_COD_PARAG,
            C_COD_CORRP: data.rows.item(i).C_COD_CORRP,
            V_NOM_PARA: data.rows.item(i).V_NOM_PARA,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /// -------- Creación de la tabla SIMENH_ING_MOVIL_WEB  --------  ///

  createTableING_MOVIL_WEB() {
    console.log('Se creo la tabla SIMENH_ING_MOVIL_WEB');
    return this.database.executeSql('create table if not exists SIMENH_ING_MOVIL_WEB( ID_CABECERA INTEGER primary key autoincrement, V_COD_ESTA TEXT, ID_HORA_SINOPTICA TEXT, FECHA_MOVIL TEXT, DETALLE TEXT,FORM TEXT,FLAG TEXT )', []);
  }

  addING_MOVIL_WEB(ING_MOVIL_WEB: { ID_CABECERA: any; V_COD_ESTA: any; ID_HORA_SINOPTICA: any; FECHA_MOVIL: any; DETALLE: any; FORM: any; FLAG: any }) {
    const sql = 'INSERT INTO SIMENH_ING_MOVIL_WEB (ID_CABECERA, V_COD_ESTA,ID_HORA_SINOPTICA,FECHA_MOVIL,DETALLE,FORM,FLAG) values (?,?,?,?,?,?,?)';
    return this.database.executeSql(sql, [ING_MOVIL_WEB.ID_CABECERA, ING_MOVIL_WEB.V_COD_ESTA, ING_MOVIL_WEB.ID_HORA_SINOPTICA, ING_MOVIL_WEB.FECHA_MOVIL, ING_MOVIL_WEB.DETALLE, ING_MOVIL_WEB.FORM, ING_MOVIL_WEB.FLAG]);
  }

  getING_MOVIL_WEB(V_COD_ESTA, FLAG) {
    const sql = 'SELECT * FROM SIMENH_ING_MOVIL_WEB WHERE V_COD_ESTA= ? AND FLAG=? ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA, FLAG]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_MOVIL_WEB_LISTAR(V_COD_ESTA) {
    const sql = 'SELECT * FROM SIMENH_ING_MOVIL_WEB WHERE V_COD_ESTA= ? AND NOT FLAG=3 ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_MOVIL_WEB_ID(ID_CABECERA) {
    const sql = 'SELECT * FROM SIMENH_ING_MOVIL_WEB WHERE ID_CABECERA= ?';
    return this.database.executeSql(sql, [ID_CABECERA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_MOVIL_WEB_ID_HORA(V_COD_ESTA, ID_HORA_SINOPTICA) {
    const sql = 'SELECT * FROM SIMENH_ING_MOVIL_WEB WHERE V_COD_ESTA= ? AND ID_HORA_SINOPTICA=? ORDER BY ID_CABECERA DESC LIMIT 7';
    return this.database.executeSql(sql, [V_COD_ESTA, ID_HORA_SINOPTICA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            ID_HORA_SINOPTICA: data.rows.item(i).ID_HORA_SINOPTICA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  updateTableING_MOVIL_MOV_WEB(ID_CABECERA) {
    console.log('UPDATE SIMENH_ING_MOVIL_WEB SET FLAG=1 WHERE ID_CABECERA=' + ID_CABECERA);
    return this.database.executeSql('UPDATE SIMENH_ING_MOVIL_WEB SET FLAG="1" WHERE ID_CABECERA=?', [ID_CABECERA]);
  }

  /// -------- Creación de la tabla SIMENH_ING_AFORO_MOV_WEB  --------  ///
  createTableING_AFORO_MOV_WEB() {
    console.log('Se creo la tabla SIMENH_ING_AFORO_MOV_WEB');
    return this.database.executeSql('create table if not exists SIMENH_ING_AFORO_MOV_WEB( ID_CABECERA INTEGER primary key autoincrement, V_COD_ESTA TEXT TEXT, FECHA_MOVIL TEXT, DETALLE TEXT,FORM TEXT,FLAG TEXT )', []);
  }

  addING_AFORO_MOV_WEB(ING_AFORO_MOV_WEB: { ID_CABECERA: any; V_COD_ESTA: any; FECHA_MOVIL: any; DETALLE: any; FORM: any; FLAG: any }) {
    const sql = 'INSERT INTO SIMENH_ING_AFORO_MOV_WEB (ID_CABECERA, V_COD_ESTA,FECHA_MOVIL,DETALLE,FORM,FLAG) values (?,?,?,?,?,?)';
    return this.database.executeSql(sql, [ING_AFORO_MOV_WEB.ID_CABECERA, ING_AFORO_MOV_WEB.V_COD_ESTA, ING_AFORO_MOV_WEB.FECHA_MOVIL, ING_AFORO_MOV_WEB.DETALLE, ING_AFORO_MOV_WEB.FORM, ING_AFORO_MOV_WEB.FLAG]);
  }

  getING_AFORO_MOV_WEB(V_COD_ESTA, FLAG) {
    const sql = 'SELECT * FROM SIMENH_ING_AFORO_MOV_WEB WHERE V_COD_ESTA= ? AND FLAG=? ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA, FLAG]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_AFORO_MOV_WEB_LISTAR(V_COD_ESTA) {
    const sql = 'SELECT * FROM SIMENH_ING_AFORO_MOV_WEB WHERE V_COD_ESTA= ? AND NOT FLAG=3 ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_AFORO_MOV_WEB_ID(ID_CABECERA) {
    const sql = 'SELECT * FROM SIMENH_ING_AFORO_MOV_WEB WHERE ID_CABECERA= ?';
    return this.database.executeSql(sql, [ID_CABECERA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  updateTableING_AFORO_MOV_WEB(ID_CABECERA) {
    console.log('UPDATE SIMENH_ING_AFORO_MOV_WEB SET FLAG=1 WHERE ID_CABECERA=' + ID_CABECERA);
    return this.database.executeSql('UPDATE SIMENH_ING_AFORO_MOV_WEB SET FLAG="1" WHERE ID_CABECERA=?', [ID_CABECERA]);
  }

  /// -------- Creación de la tabla SIMENH_ING_EVENTO_MOV_WEB  --------  ///
  createTableING_EVENTO_MOV_WEB() {
    console.log('Se creo la tabla SIMENH_ING_EVENTO_MOV_WEB');
    return this.database.executeSql('create table if not exists SIMENH_ING_EVENTO_MOV_WEB( ID_CABECERA INTEGER primary key autoincrement, V_COD_ESTA TEXT TEXT, FECHA_MOVIL TEXT, DETALLE TEXT,FORM TEXT, FLAG TEXT )', []);
  }

  addING_EVENTO_MOV_WEB(ING_AFORO_MOV_WEB: { ID_CABECERA: any; V_COD_ESTA: any; FECHA_MOVIL: any; DETALLE: any; FORM: any; FLAG: any }) {
    const sql = 'INSERT INTO SIMENH_ING_EVENTO_MOV_WEB (ID_CABECERA, V_COD_ESTA,FECHA_MOVIL,DETALLE,FORM,FLAG) values (?,?,?,?,?,?)';
    return this.database.executeSql(sql, [ING_AFORO_MOV_WEB.ID_CABECERA, ING_AFORO_MOV_WEB.V_COD_ESTA, ING_AFORO_MOV_WEB.FECHA_MOVIL, ING_AFORO_MOV_WEB.DETALLE, ING_AFORO_MOV_WEB.FORM, ING_AFORO_MOV_WEB.FLAG]);
  }

  getING_EVENTO_MOV_WEB(V_COD_ESTA, FLAG) {
    const sql = 'SELECT * FROM SIMENH_ING_EVENTO_MOV_WEB WHERE V_COD_ESTA= ? AND FLAG=? ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA, FLAG]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_EVENTO_MOV_WEB_LISTAR(V_COD_ESTA) {
    const sql = 'SELECT * FROM SIMENH_ING_EVENTO_MOV_WEB WHERE V_COD_ESTA= ? AND NOT FLAG=3 ORDER BY ID_CABECERA DESC';
    return this.database.executeSql(sql, [V_COD_ESTA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getING_EVENTO_MOV_WEB_ID(ID_CABECERA) {
    const sql = 'SELECT * FROM SIMENH_ING_EVENTO_MOV_WEB WHERE ID_CABECERA= ?';
    return this.database.executeSql(sql, [ID_CABECERA]).then((data) => {
      const developers: any = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            ID_CABECERA: data.rows.item(i).ID_CABECERA,
            V_COD_ESTA: data.rows.item(i).V_COD_ESTA,
            FECHA_MOVIL: data.rows.item(i).FECHA_MOVIL,
            DETALLE: data.rows.item(i).DETALLE,
            FORM: data.rows.item(i).FORM,
            FLAG: data.rows.item(i).FLAG,
          });
        }
      }
      return Promise.resolve(developers);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
  updateTableING_EVENTO_MOV_WEB(ID_CABECERA) {
    console.log('UPDATE SIMENH_ING_EVENTO_MOV_WEB SET FLAG=1 WHERE ID_CABECERA=' + ID_CABECERA);
    return this.database.executeSql('UPDATE SIMENH_ING_EVENTO_MOV_WEB SET FLAG="1" WHERE ID_CABECERA=?', [ID_CABECERA]);
  }
}
