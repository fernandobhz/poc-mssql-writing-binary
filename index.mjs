import fs from "fs";
import sql from "mssql";

await sql.connect({
    user: "sa",
    password: "12345678",
    database: "test",
    server: "localhost",
    options: {
        trustServerCertificate: true
    }
});

/*
    CREATE TABLE [dbo].[test](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [theImage] [image] NULL,
        [theBinary] [varbinary](max) NULL
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
*/

fs.readFile("inputFile.txt", "binary", function (err, fileData) {
  var binBuff = new Buffer(fileData, "binary");
  var ps = new sql.PreparedStatement();
  ps.input("theImage", sql.Image);
  ps.input("theBinary", sql.VarBinary);
  ps.prepare("INSERT INTO test (theImage, theBinary) VALUES (@theImage, @theBinary)", function (err) {
    ps.execute({ theImage: binBuff,  theBinary: binBuff }, function (err, records) {
      if (err) throw err;

      ps.unprepare(function (err) {
        if (err) throw err;
        console.log("done");
      });
    });
  });
});
