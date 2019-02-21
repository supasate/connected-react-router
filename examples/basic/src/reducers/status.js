const statusReducer = (state = 0, action) => {
  switch (action.type) {
    case 'updateStatus':
      return action.status
    default:
      return state
  }
}

export default statusReducer
