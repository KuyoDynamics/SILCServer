/**
 * The BATCH and JOURNAL tables are used to control 
 * the input of the double entries to the POSTING table.
 * A JOURNAL entry is the data representation of any business
 * transaction that will produce double entries — it represents 
 * a complete unit of work.
 * I.e. all POSTING entries associated with the JOURNAL entry must 
 * be successfully completed or none must be completed. 
 * The numerical sum of all POSTING entries associated with a JOURNAL entry 
 * must also equal zero (the only way the total value contained in the system 
 * can be amended is though the Cash Book). 
 * Each transaction would be represented  by one JOURNAL entry.
 */