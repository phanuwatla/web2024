const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaXmCl5VotU2D_iBGtDKWx_7rCxA8iY0U",
  authDomain: "web2567-8150d.firebaseapp.com",
  projectId: "web2567-8150d",
  storageBucket: "web2567-8150d.firebasestorage.app",
  messagingSenderId: "613624665287",
  appId: "1:613624665287:web:130098aa5b2cd574b91ae2",
  measurementId: "G-FB9VT56SHW",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      students: [],
      user: null,
    };

    auth.onAuthStateChanged((user) => {
      this.setState({ user: user ? user.toJSON() : null });
    });
  }

  readData() {
    db.collection("students")
      .get()
      .then((querySnapshot) => {
        let studentsList = [];
        querySnapshot.forEach((doc) => {
          studentsList.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ students: studentsList });
      });
  }

  autoRead() {
    db.collection("students").onSnapshot((querySnapshot) => {
      let studentsList = [];
      querySnapshot.forEach((doc) => {
        studentsList.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: studentsList });
    });
  }

  googleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    auth.signInWithPopup(provider);
  }

  googleLogout() {
    if (confirm("ต้องการออกจากระบบหรือไม่?")) {
      auth.signOut();
    }
  }

  insertData() {
    db.collection("students").doc(this.state.stdid).set({
      title: this.state.stdtitle,
      fname: this.state.stdfname,
      lname: this.state.stdlname,
      phone: this.state.stdphone,
      email: this.state.stdemail,
    });
  }

  edit(std) {
    this.setState({
      stdid: std.id,
      stdtitle: std.title,
      stdfname: std.fname,
      stdlname: std.lname,
      stdemail: std.email,
      stdphone: std.phone,
    });
  }

  delete(std) {
    if (confirm("ต้องการลบข้อมูล")) {
      db.collection("students").doc(std.id).delete();
    }
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <div class="header">
            <Alert variant="info">
              Welcome to Work6
              <p>เรียกใช้ฐานข้อมูล Firebase ด้วย ReactJS</p>
            </Alert>
            <LoginBox user={this.state.user} app={this} />
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2 btnGroup">
            <Button onClick={() => this.readData()} className="btn btn-primary">
              Read Data
            </Button>
            <Button
              onClick={() => this.autoRead()}
              className="btn btn-secondary"
            >
              Auto Read
            </Button>
          </div>
          <div>
            <StudentTable data={this.state.students} app={this} />
          </div>
        </Card.Body>
        <Card.Footer>
          <p class="addTitle">เพิ่ม/แก้ไขข้อมูล นักศึกษา</p>
          <div className="d-flex gap-2">
            <TextInput
              label="รหัสนักศึกษา"
              app={this}
              value="stdid"
              style={{ width: 120 }}
            />
            <TextInput
              label="คำนำหน้า"
              app={this}
              value="stdtitle"
              style={{ width: 100 }}
            />
            <TextInput
              label="ชื่อ"
              app={this}
              value="stdfname"
              style={{ width: 120 }}
            />
            <TextInput
              label="นามสกุล"
              app={this}
              value="stdlname"
              style={{ width: 120 }}
            />
            <TextInput
              label="Email"
              app={this}
              value="stdemail"
              style={{ width: 150 }}
            />
            <TextInput
              label="เบอร์โทรศัพท์"
              app={this}
              value="stdphone"
              style={{ width: 120 }}
            />
          </div>
          <Button
            onClick={() => this.insertData()}
            className="btn btn-success mt-2"
          >
            Save
          </Button>
        </Card.Footer>
        <Card.Footer className="text-center">
          College of Computing, Khon Kaen University By 663380179-0 Phanuwat Lakronratch
        </Card.Footer>
      </Card>
    );
  }
}

function LoginBox(props) {
  const user = props.user;
  const app = props.app;

  if (!user) {
    return (
      <div>
        <Button onClick={() => app.googleLogin()}>Login</Button>
      </div>
    );
  } else {
    return (
      <div class="profile">
        <img src={user.photoURL} width="40" height="40" alt="profile" />
        <div class="account">
          <p>{user.displayName}</p>
          <p class="email">{user.email}</p>
        </div>
        <Button onClick={() => app.googleLogout()}>Logout</Button>
      </div>
    );
  }
}

function StudentTable({ data, app }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>นามสกุล</th>
          <th>Email</th>
          <th>เบอร์โทรศัพท์</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            <td>{s.phone}</td>
            <td>
              <div className="d-flex gap-2">
                <EditButton std={s} app={app} />
                <DeleteButton std={s} app={app} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function TextInput({ label, app, value, style }) {
  return (
    <label className="form-label">
      {label}:
      <input
        className="form-control"
        style={style}
        value={app.state[value]}
        onChange={(ev) => {
          var s = {};
          s[value] = ev.target.value;
          app.setState(s);
        }}
      ></input>
    </label>
  );
}

function EditButton({ std, app }) {
  return (
    <button class="actionBtn" onClick={() => app.edit(std)}>
      <i class="fa-regular fa-pen-to-square"></i> แก้ไข
    </button>
  );
}

function DeleteButton({ std, app }) {
  return (
    <button class="actionBtn" onClick={() => app.delete(std)}>
      <i class="far fa-trash-alt"></i> ลบ
    </button>
  );
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
