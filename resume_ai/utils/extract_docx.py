from docx import Document


def extract_text_from_docx(file_path: str) -> str:

    try:
        doc = Document(file_path)
    except Exception as e:
        raise Exception(f"Failed to open DOCX file: {str(e)}")

    paragraphs = []

    for paragraph in doc.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs)
