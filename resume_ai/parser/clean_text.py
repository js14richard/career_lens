import re
from bs4 import BeautifulSoup


def clean_text(text: str) -> str:

    if not text:
        return ""

    text = BeautifulSoup(text, "html.parser").get_text(separator="\n")

    bullet_patterns = [
        r"•", r"●", r"▪", r"■", r"–", r"—", r"- "
    ]
    for symbol in bullet_patterns:
        text = text.replace(symbol, "- ")

    text = text.encode("ascii", "ignore").decode()

    text = re.sub(r"\s+", " ", text)

    text = re.sub(r"\n\s*\n+", "\n", text)

    text = text.strip()

    return text
