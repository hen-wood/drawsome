require("dotenv").config();

const GCPcredentials = {
	type: "service_account",
	project_id: "drawsome-382915",
	private_key_id: "a499b6b855ca71f8c09f734f62875bc20ddd2a44",
	private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
	client_email: "drawsome@drawsome-382915.iam.gserviceaccount.com",
	client_id: "113790223785820360730",
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url:
		"https://www.googleapis.com/robot/v1/metadata/x509/drawsome%40drawsome-382915.iam.gserviceaccount.com"
};

module.exports = GCPcredentials;
