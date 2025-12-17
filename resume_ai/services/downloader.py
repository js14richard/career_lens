import requests
import tempfile
import os
from urllib.parse import urlparse


def download_file_from_url(file_url: str) -> str:

    parsed = urlparse(file_url)
    if not parsed.scheme.startswith("http"):
        raise Exception("Invalid URL provided")

    response = requests.get(file_url, stream=True)
    print(response)
    if response.status_code != 200:
        raise Exception(f"Failed to download file. HTTP {response.status_code}")

    file_ext = os.path.splitext(parsed.path)[1].lower()
    if file_ext not in [".pdf", ".docx"]:
        raise Exception(f"Unsupported file type: {file_ext}")

    temp_fd, temp_path = tempfile.mkstemp(suffix=file_ext)
    os.close(temp_fd)

    with open(temp_path, "wb") as temp_file:
        for chunk in response.iter_content(chunk_size=8192):
            temp_file.write(chunk)

    return temp_path
