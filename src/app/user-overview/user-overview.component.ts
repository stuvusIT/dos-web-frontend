import { Component, OnInit } from '@angular/core';

import { User } from '../user'
import { UserService } from '../user.service'

@Component({
  selector: 'user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {
  readonly letters = (() => {
    const letters: string[] = []
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
      letters.push(String.fromCharCode(i))
    }
    return letters
  })()

  usersByLetter: { [letter: string]: User[] } = { }

  loading = false
  errorMessage: string = null

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.hideError()
    this.loading = true
    this.userService.getAll()
      .then(usernames => usernames.map(username => this.userService.getByUsername(username)))
      .then(requests => Promise.all(requests))
      .then(users => {
        const usersByLetter: { [letter: string]: User[] } = users.reduce((acc, user) => {
          const letter = user.uid.charAt(0).toLowerCase()
          acc[letter] = acc[letter] || []
          acc[letter].push(user)
          return acc
        }, { })
        console.dir(usersByLetter)
        this.usersByLetter = usersByLetter
      })
      .then(() => this.loading = false)
      .catch(err => {
        this.loading = false
        this.displayError(err)
      })
  }

  displayError(message: string) {
    this.errorMessage = message
  }

  hideError() {
    this.errorMessage = null
  }
}
