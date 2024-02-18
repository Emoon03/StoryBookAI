import base64
import sys
import requests

def main():
    # Paste your model id below
    voice = wav_to_base64("./audio/morganfreeman.wav")
    text = "Listen up, people. Life's a wild ride, and sometimes you gotta grab it by the horns and steer it where you want to go. You can't just sit around waiting for things to happen – you gotta make 'em happen. Yeah, it's gonna get tough, but that's when you dig deep, find that inner badass, and come out swinging. Remember, success ain't handed to you on a silver platter; you gotta snatch it like it owes you money. So, lace up your boots, square those shoulders, and let the world know that you're here to play, and you're playing for keeps"
    data = {"text": text, "speaker_voice": voice, "language": "en"}

    resp = requests.post(
        "https://model-5qelep03.api.baseten.co/production/predict",
        headers={"Authorization": "Api-Key jx14E46a.7BWZCjLOBwgd6kHdmDEQ73h1gpoPycb6"},
        json=data
    )

    resp = resp.json()
    output = resp
    print(output)



def wav_to_base64(file_path):
    with open(file_path, "rb") as wav_file:
        binary_data = wav_file.read()
        base64_data = base64.b64encode(binary_data)
        base64_string = base64_data.decode("utf-8")
        return base64_string
    
def base64_to_wav(base64_string, output_file_path):
    binary_data = base64.b64decode(base64_string)
    with open(output_file_path, "wb") as wav_file:
        wav_file.write(binary_data)


main()