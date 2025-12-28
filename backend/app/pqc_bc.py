import time
from pqc_utils import KyberCipher, generate_symmetric_key, encrypt_with_key

# Classical AES
key = generate_symmetric_key()
message = b"Hello world cloud " * 1000

start_classical = time.time()
ciphertext = encrypt_with_key(message, key)
end_classical = time.time()
classical_time = end_classical - start_classical

# PQC (Kyber hybrid)
cipher = KyberCipher()
start_pqc = time.time()
encrypted, pqc_key = cipher.encrypt(message)
end_pqc = time.time()
pqc_time = end_pqc - start_pqc

# Calculate PQC overhead
overhead = ((pqc_time - classical_time) / classical_time) * 100
print(f"Classical AES time: {classical_time:.6f}s")
print(f"PQC hybrid time:    {pqc_time:.6f}s")
print(f"PQC Overhead:       {overhead:.2f}%")
