import './styles.css'
import { useReducer } from 'react'
import { DigitButton } from './DigitButton'
import { OperationButton } from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    default:
      throw new Error()
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (state.overwrite)
        return { ...state, currentOperand: payload.digit, overwrite: false }
      if (
        payload.digit === '.' &&
        state.currentOperand &&
        state.currentOperand.includes('.')
      )
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand === null) return state
      if (state.currentOperand && state.currentOperand.length === 1)
        return { ...state, currentOperand: null }
      return {
        ...state,
        currentOperand:
          state.currentOperand && state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      console.log(state.operation, state.currentOperand, state.previousOperand)
      if (
        state.operation != null &&
        state.currentOperand == null &&
        state.previousOperand != null
      )
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operation: null,
        }

      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return state

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null)
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      }
  }
}

const INTERGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return

  const [integer, decimal] = operand.split('.')

  if (decimal == null) return INTERGER_FORMATTER.format(integer)
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}

const evaluate = ({ previousOperand, currentOperand, operation }) => {
  const prev = +previousOperand
  const curr = +currentOperand
  console.log(previousOperand, currentOperand, operation)
  if (prev && !currentOperand) return prev
  if (isNaN(prev) || isNaN(curr)) return ''
  let computation = ''
  switch (operation) {
    default:
    case '+':
      computation = prev + curr
      break
    case '-':
      computation = prev - curr
      break
    case 'x':
      computation = prev * curr
      break
    case '÷':
      computation = prev / curr
      break
  }
  return computation.toString()
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {},
  )

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">
            {' '}
            {formatOperand(currentOperand)}{' '}
          </div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button
          className=""
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="x" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton dispatch={dispatch} digit="0" />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  )
}

export default App
