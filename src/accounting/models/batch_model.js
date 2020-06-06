/**
 * The BATCH and JOURNAL tables are used to control 
 * the input of the double entries to the POSTING table.
 * A BATCH entry reflects the more physical aspects of 
 * accounting data entry. 
 * It is used to group together JOURNAL entries into handy ‘chunks’, for example, 
 * a collection of cheques to be entered into the system, 
 * a collection of information from an Electronic Data Interface (EDI) 
 * or a global business process like the payment of interest to all accounts.
 * There are some activities that occur within accounting systems that are 
 * large scale changes that affect many or all of the accounts. 
 * For example, payment of interest to all accounts as a percentage of their
 * current balance or a global cut of quota by a certain percentage. 
 * The end of year example above also falls into this category. 
 * The end of year entries should all be done under the same JOURNAL 
 * (although it could be argued that separate currencies/assets could
 *  be done under separate journals) but it is quite acceptable 
 * to aggregate the entries to the Cash Book. 
 * The accounting rule requirements will still be met but it will simplify
 * the work and volumes involved by up to 50%. 
 * 
 * A batching mechanism is often used to facilitate data entry to 
 * this accounting system. 
 * In its historic form this is what has happened for the processing of cheques.
 * An account clerk would be given a pile of ten cheques, a batch number and 
 * the total value of the cheques.
 * An entry screen would then be used by the clerk to record the cheques 
 * as ‘unauthorised’ entries.
 * At the BATCH level the number of cheques and their total value is recorded 
 * and only when the number of items entered and their totals match these figures 
 * is the user allowed to commit the batch. 
 * Once this activity is complete the batch is passed to another member of staff 
 * who checks the contents of the batch (either on-screen or with the aide of a report)
 * and then ‘authorises’ the batch if it is correct. 
 * This process is generally referred to as ‘maker/checker’ and can be adapted for the manual entry of any primary asset data. 
 * The concept of a Batch is also useful for electronic data transfer as it 
 * provides a method of aggregation for audit trail and correction processing. 
 * As a rule it is sensible to keep the details of ‘unauthorised’ entries in 
 * separate tables from those ‘pucker’ double entries made by the 
 * ‘authorisation’ process into the POSTING table. 
 * If this is done it is also possible to simplify the programming effort by 
 * creating tables more appropriate to the business function in hand. 
 * For example, in the above cheque entry process the clerk will only have to 
 * identify one account. 
 * The other account, the Cash Book, is implicit as the movement of money will 
 * always be from the Cash Book to the owners account. 
 * A CHEQUE table would only require one Account column where as a hypothetical 
 * FUND TRANSFER table would need two, a ‘From Account’ column and a ‘To Account’column.
 * This is where most of the confusion over the concepts of 
 * double-entry principlesarise.
 * Most people only come across simple paper Cash Books in the normal 
 * course of domestic events. 
 * In a paper Cash Book used for example, to record a club’s funds, only one 
 * entry per transaction is required. 
 * This is still an implicit double entry system because, as only one account is
 * represented (the ‘club’ in this example) the opposite entry can only ever 
 * go against the Cash Book — it is only ever a movement into the system 
 * (into club funds) or out of the system (paid out of the club funds). 
 * This is also where the other main source of confusion occurs. 
 * An individual’s bank statement will show money paid into the bank account 
 * as a ‘credit’ because the individual is a creditor to the
 *  bank — they have that individual’s money. 
 * If that same individual ran a Cash Book this figure should be represented 
 * as a ‘debt’ — the bank owes the money/is in debt to that individual. 
 * The money is out of that individuals system and in the bank’s.
 */