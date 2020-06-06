async function watchCollections(connection) {
  console.log("connected to the database server");
  // open change stream and watch
  let changeStream = await connection.collection("users").watch();
  console.log(`watching database changes on MongoDB's Users Collection...`);
  changeStream.on("change", (next) => {
    //process next document
    console.log(`changed _id: ${next?._id}`);
    console.log(`changed operationType: ${next?.operationType}`);
    console.log(`changed full document: ${JSON.stringify(next?.fullDocument)}`);
    console.log(
      `changed documentKey(for insert, replace, delete, update): ${next?.documentKey}`
    );
    console.log(
      `changed updateDescription(update): ${next?.updateDescription}`
    );
    console.log(
      `changed updateDescription.updatedFields(update): ${next?.updateDescription?.updatedFields}`
    );
    console.log(
      `changed updateDescription.removedFields(update): ${next?.updateDescription?.removedFields}`
    );
  });
  //check if user deleted or updated, then invalidate matching user's auth token
}

module.exports = {
  watchCollections,
};
