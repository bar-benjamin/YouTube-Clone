import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/process-video", (req, res) => {
    const input_file_path = req.body.input_file_path;
    const output_file_path = req.body.output_file_path;

    if (!input_file_path || !output_file_path) {
        res.status(400).send("Bad Request: Missing file path");
    }

    ffmpeg(input_file_path)
        .outputOptions("-vf", "scale=-1:360")
        .on('end', () => {
            console.log('Processing finished successfully!');
            res.status(200).send('Processing finished successfully');
        })
        .on('error', (err: any) => {
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send(`An error occurred: ${err.message}`)
        })
        .save(output_file_path);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(
        `Video processing service listening at http://localhost:${PORT}`);
});

