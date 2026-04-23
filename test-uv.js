const xor = {
    encode(str) {
        if (!str) return str;
        return encodeURIComponent(
            str.split("").map((e, i) => i % 2 ? String.fromCharCode(e.charCodeAt(0) ^ 2) : e).join("")
        );
    },
    decode(str) {
        if (!str) return str;
        let [a, ...b] = str.split("?");
        return (
            decodeURIComponent(a).split("").map((e, i) => i % 2 ? String.fromCharCode(e.charCodeAt(0) ^ 2) : e).join("") +
            (b.length ? "?" + b.join("?") : "")
        );
    }
};

const input1 = "https://duckduckgo.com/?q=cool%20math%20games";
const input2 = "https://www.google.com/search?q=cool%20math%20games";

console.log("XOR duckduckgo:", xor.encode(input1), "Decoded:", xor.decode(xor.encode(input1)));
console.log("XOR google:", xor.encode(input2), "Decoded:", xor.decode(xor.encode(input2)));
