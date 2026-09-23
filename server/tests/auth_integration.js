(async () => {
  const base = "http://localhost:5000";
  const testUser = {
    full_name: "Test User",
    email: "test@example.com",
    password: "Password123",
    role: "CITIZEN",
  };

  function log(msg, obj) {
    console.log(msg, obj ? JSON.stringify(obj) : "");
  }

  try {
    // Register
    let res = await fetch(base + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    let body = await res.text();
    let json;
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = { raw: body };
    }
    log("REGISTER status", { status: res.status });
    log("REGISTER body", json);

    let setCookie = res.headers.get("set-cookie");
    if (res.status === 201) {
      log("REGISTER set-cookie", { setCookie });
    } else if (res.status === 409) {
      log("REGISTER conflict - user exists", {});
    } else if (res.status === 400) {
      log("REGISTER bad request", {});
    }

    // Login (always perform login to ensure cookie set)
    res = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    body = await res.text();
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = { raw: body };
    }
    log("LOGIN status", { status: res.status });
    log("LOGIN body", json);

    setCookie = res.headers.get("set-cookie");
    log("LOGIN set-cookie", { setCookie });

    const cookie = setCookie ? setCookie.split(";")[0] : null;

    if (!cookie) {
      console.error("No cookie set by login. Test cannot continue.");
      process.exitCode = 2;
      return;
    }

    // GET /me while authenticated
    res = await fetch(base + "/api/auth/me", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    body = await res.text();
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = { raw: body };
    }
    log("ME (auth) status", { status: res.status });
    log("ME (auth) body", json);

    // Logout
    res = await fetch(base + "/api/auth/logout", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    body = await res.text();
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = { raw: body };
    }
    log("LOGOUT status", { status: res.status });
    log("LOGOUT body", json);

    // GET /me after logout
    res = await fetch(base + "/api/auth/me", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    body = await res.text();
    try {
      json = JSON.parse(body);
    } catch (e) {
      json = { raw: body };
    }
    log("ME (after logout) status", { status: res.status });
    log("ME (after logout) body", json);
  } catch (err) {
    console.error("Error during integration test", err);
    process.exitCode = 1;
  }
})();
