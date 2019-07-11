/**
 * The POSTING table contains the actual accounting double entries. 
 * Keeping the figures in one table simplifies the mathematics dramatically. 
 * The primary key or part of the primary key of the POSTING table should 
 * be a system generated sequence number. 
 * It should also be generated in such a way that no gaps can appear in 
 * the sequence (through a transaction rolling back, for example). 
 * This is part of ensuring that no entries are ever deleted.
 * The balance of the POSTING Amount column always being zero after every complete
 * JOURNAL transaction (and the software must not allow an incomplete one).
 */
