import fitz  # PyMuPDF


def extract_text_from_pdf(file_path: str):
    """
    Extracts text from a PDF resume using PyMuPDF.
    
    Returns:
        text (str): extracted raw text
        page_count (int): number of pages in the PDF
    """

    try:
        doc = fitz.open(file_path)
    except Exception as e:
        raise Exception(f"Failed to open PDF: {str(e)}")

    if doc.is_encrypted:
        try:
            doc.authenticate("")
        except Exception:
            raise Exception("PDF is encrypted and cannot be processed")

    full_text = ""

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        full_text += text + "\n"

    page_count = len(doc)
    doc.close()

    return full_text.strip(), page_count
