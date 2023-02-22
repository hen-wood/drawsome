const AWS = require("aws-sdk");
// name of your bucket here
const NAME_OF_BUCKET = "drawsome-images";

const multer = require("multer");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// --------------------------- Public UPLOAD ------------------------

const uploadDrawingToS3 = async dataURL => {
	const Body = Buffer.from(
		dataURL.replace(/^data:image\/\w+;base64,/, ""),
		"base64"
	);

	// Name of the file will be the current date in MS + .png
	const Key = new Date().getTime().toString() + ".png";
	const uploadParams = {
		Bucket: NAME_OF_BUCKET,
		Key,
		Body,
		ContentType: "image/png",
		ACL: "public-read"
	};
	const result = await s3.upload(uploadParams).promise();

	// Return the url of the uploaded file
	return result.Location;
};

// --------------------------- Storage ------------------------

const storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, "");
	}
});

const singleMulterUpload = nameOfKey =>
	multer({ storage: storage }).single(nameOfKey);

module.exports = {
	s3,
	uploadDrawingToS3,
	singleMulterUpload
};
