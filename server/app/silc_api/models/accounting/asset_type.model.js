/**
 * The ASSET TYPE table contains the list of asset types being held in the system.
 * By making the asset type part of the POSTING primary key the system becomes
 * a multi-asset (e.g multi-currency) system.
 * Through use of this, the system can also track the ownership of other
 * ‘de-materialised’ assets where the actual ownership of any particular
 * item isn’t required just the type and quantity owned.
 * Examples of this type of asset includes shares and agricultural
 * or pollution quota. It can also track ‘bearer’ assets 
 * (where, for example, the fact that certificate number 12345
 * belongs to Mrs X is important).
 */