function powerMod(base, exp, mod) {
    if (mod == 1) return 0n;
    let result = 1n;
    mod = BigInt(mod);
    base = BigInt(base) % mod;
    exp = BigInt(exp);

    // Use exponentiation by squaring
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp >> 1n; // divide by 2
        base = (base * base) % mod;
    }
    return result;
}

function isPrime(n) {
    n = BigInt(n);

    // Deterministic Miller-Rabin for n < 2^64.
    if (n < 2)
        return false;
    if(n == 2 || n == 3)
        return true;
    if(n % 2n == 0)
        return false;

    // Write n-1 as 2^r * d
    let r = 0, d = n - 1n;
    while (d % 2n == 0) {
        r++;
        d /= 2n;
    }

    // Deterministic witnesses for 64-bit integers
    const witnesses = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

    outer: for(a of witnesses) {
        if (n == a)
            return true;
        if (a >= n)
            break;
            
        // Compute a^d % n
        let x = powerMod(a, d, n);
        
        if(x == 1 || x == n - 1n)
            continue;
        
        for(let i = 0; i < r - 1; i++) {
            x = powerMod(x, 2, n);
            if(x == n - 1n)
                continue outer;
        }
        return false;
    }
    return true;
}

module.exports = {
    isPrime
}
