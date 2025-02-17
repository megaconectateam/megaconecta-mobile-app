export type SetCall = {
  directDialCall: string;
  translation: {
    INCOMING_NO: string;
    OUTGOING_NO: string;
    TRANS_TYPE: number;
    ACCOUNTNO: string;
    DESCRIPTION: string;
    DIRECT_DIAL_NUMBER: string;
    TRANS_ID: string;
  };
};

export type CallReport = {
  called_number: string;
  duration: number;
  rate_table: string;
  country_code: string;
  country_name: string;
  cost_before_fees: number;
  call_connect_time: string;
  call_disconnect_time: string;
};

/*
  called_number:5343596771
  duration:3
  rate_table:Cuba [53]
  cost_before_fees:2.07
  call_connect_time:29/09/2022 12:18 pm
  call_disconnect_time:29/09/2022 12:21 pm


  called_number:5352629471
  duration:1
  rate_table:Cuba [53]
  cost_before_fees:0.69
  call_connect_time:03/05/2022 10:16 am
  call_disconnect_time:03/05/2022 10:16 am
*/
