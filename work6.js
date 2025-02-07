const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      students: [],
      user: null
    };

    auth.onAuthStateChanged(user => {
      this.setState({ user: user ? user.toJSON() : null });
    });
  }

  readData() {
    db.collection("students").get().then(querySnapshot => {
      let studentsList = [];
      querySnapshot.forEach(doc => {
        studentsList.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: studentsList });
    });
  }

  autoRead() {
    db.collection("students").onSnapshot(querySnapshot => {
      let studentsList = [];
      querySnapshot.forEach(doc => {
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

  render() {
    return (
      <Card>
        <Card.Header>
          <Alert variant="info">
            <b>Work6 :</b> Firebase
          </Alert>
          <LoginBox user={this.state.user} app={this} />
        </Card.Header>
        <Card.Body>
          <Button onClick={() => this.readData()}>Read Data</Button>
          <Button onClick={() => this.autoRead()}>Auto Read</Button>
          <StudentTable data={this.state.students} app={this} />
        </Card.Body>
        <Card.Footer>
          College of Computing, Khon Kaen University
        </Card.Footer>
      </Card>
    );
  }
}

function LoginBox(props) {
  const user = props.user;
  const app = props.app;

  if (!user) {
    return <div><Button onClick={() => app.googleLogin()}>Login</Button></div>;
  } else {
    return (
      <div>
        <img src={user.photoURL} width="40" height="40" alt="profile" />
        {user.email}
        <Button onClick={() => app.googleLogout()}>Logout</Button>
      </div>
    );
  }
}

function StudentTable({ data, app }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>รหัส</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>นามสกุล</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
