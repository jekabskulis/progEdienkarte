import Table from "react-bootstrap/Table";
//import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {useState, useEffect} from "react";
import "./App.css";

//Default input values
const newCardDefaultValue = 
{
  name: "",
  price: "",
  imgSrc: ""
}


function App() {
  //useStates and useEffects
  const[newCardValue, setNewCardValue] = useState(newCardDefaultValue)
  const[cards, setCards] = useState([])
  
  //Returns info from the database
  const getValueList = () =>
  {
    fetch("http://localhost:3004/foodList")
    .then((rep) => rep.json())
    .then((allCards) =>
    {
      setCards(allCards)
    })
  }

  useEffect(() =>
  {
    /*
    const runInterval = setInterval(() =>
    {
      getValueList()
    }, 500)
    return () => clearInterval(runInterval)*/
    getValueList();
  }, [])

  return (
    <div>
      <div className='container'>
          <Container className="mb-3" fluid>
          <Form 
          className="card__input"
          onSubmit={(event) =>
          {
            //Prevents page from refreshing after input, saves a card into the database
            event.preventDefault()
            fetch("http://localhost:3004/foodList",
            {
              method: "POST",
              headers:
              [
                ["Content-Type", "application/json"],
                ["Accept", "application/json"],
                ["Access-Control-Allow-Origin", "*"]
              ],
              body: JSON.stringify(newCardValue)
            })
            .then((rep) => rep.json())
            .then((addedCard) =>
            {
              setCards([...cards, addedCard])
            })
            //Empties the input
            setNewCardValue(newCardDefaultValue)
          }}>
            <Row>
              <Col>
                <Form.Group className="card__group">
                  <Form.Label>Nosaukums</Form.Label>
                  <Form.Control
                  type="text"
                  placeholder="Nosaukums"
                  value={newCardValue.name}
                  onChange=
                  {
                    (event) =>
                    {
                      const updatedNewCardValue = 
                      {
                        ...newCardValue,
                        name: event.target.value
                      }
                      setNewCardValue(updatedNewCardValue)
                    }
                  }
                  required="required"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="card__group">
                  <Form.Label>Cena</Form.Label>
                  <Form.Control
                  type="text"
                  placeholder="Cena"
                  value={newCardValue.price}
                  onChange=
                  {
                    (event) =>
                    {
                      const updatedNewCardValue = 
                      {
                        ...newCardValue,
                        price: event.target.value
                      }

                      setNewCardValue(updatedNewCardValue)
                    }
                  }
                  required="required"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="card__group">
                  <Form.Label>Attēla hipersaite</Form.Label>
                  <Form.Control
                  type="text"
                  placeholder="Attēla hipersaite"
                  value={newCardValue.imgSrc}
                  onChange=
                  {
                    (event) =>
                    {
                      const updatedNewCardValue = 
                      {
                        ...newCardValue,
                        imgSrc: event.target.value
                      }

                      setNewCardValue(updatedNewCardValue)
                    }
                  }
                  required="required"
                  ></Form.Control>
                </Form.Group>
                <button variant="primary" className="card__button">Pievienot</button>
              </Col>
            </Row>
            </Form> 
            <Row>
        {Array.from(cards).map((card, index) =>
        {
            return(
                <Col key={Math.random()} className="mt-4">
                <p>{card.name}</p>
                <p>{card.price}</p>
                <p><img src={card.imgSrc} alt="" width="224px"></img></p>
            </Col>
          )
        })}
        </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
