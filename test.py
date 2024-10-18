import socket
from concurrent.futures import ThreadPoolExecutor

def check_port(ip, port=80):
    """Check if port is open on given IP address."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(1)  # set timeout to 1 second
        try:
            sock.connect((ip, port))
            return ip, True
        except (socket.timeout, ConnectionRefusedError, OSError):
            return ip, False

def scan_ips(ip_range_start, ip_range_end):
    """Scan a range of IPs for open port 80."""
    ip_base = '.'.join(ip_range_start.split('.')[:-1])
    start = int(ip_range_start.split('.')[-1])
    end = int(ip_range_end.split('.')[-1])
    ip_list = [f"{ip_base}.{i}" for i in range(start, end + 1)]

    results = {}
    with ThreadPoolExecutor(max_workers=100) as executor:
        future_to_ip = {executor.submit(check_port, ip): ip for ip in ip_list}
        for future in future_to_ip:
            ip, is_open = future.result()
            results[ip] = is_open

    return results

if __name__ == "__main__":
    for i in range(0,256):
        ip_range_start = "192.168."+str(i)+".1"
        ip_range_end = "192.168.8."+str(i)+".255"
        scan_results = scan_ips(ip_range_start, ip_range_end)
        #print("Scan completed. Results:")
        for ip, is_open in scan_results.items():
            if is_open:
                print(f"{ip}")
